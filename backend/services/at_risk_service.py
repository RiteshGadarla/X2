"""
At-risk customer detection.

Risk score (0–100) is computed from three independent factors:

Factor                          Contribution
------                          ------------
consecutive_negative_csat >= 3  +40
consecutive_negative_csat == 2  +20
ticket_frequency_30d >= 10      +30
ticket_frequency_30d >= 5       +15
sla_breach_count (last 30d) >= 3 +30
sla_breach_count (last 30d) >= 2 +15

Customers with risk_score >= 50 are flagged as at_risk.
Target: detect at-risk customers >= 27 days before churn (BRD Arjuna Req #8).
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy import or_
from sqlalchemy.orm import Session
import models


def _count_sla_breaches(customer_id, db: Session) -> int:
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    return (
        db.query(models.CSTicket)
        .filter(
            models.CSTicket.customer_id == customer_id,
            models.CSTicket.created_at >= cutoff,
            or_(
                models.CSTicket.sla_first_response_breached.is_(True),
                models.CSTicket.sla_resolution_breached.is_(True),
            ),
        )
        .count()
    )


def compute_risk_score(
    customer: models.CSCustomer,
    sla_breach_count: int,
) -> float:
    score = 0.0

    if customer.consecutive_negative_csat >= 3:
        score += 40.0
    elif customer.consecutive_negative_csat >= 2:
        score += 20.0

    if customer.ticket_frequency_30d >= 10:
        score += 30.0
    elif customer.ticket_frequency_30d >= 5:
        score += 15.0

    if sla_breach_count >= 3:
        score += 30.0
    elif sla_breach_count >= 2:
        score += 15.0

    return min(score, 100.0)


def refresh_customer_risk(customer: models.CSCustomer, db: Session) -> bool:
    """Recalculate and persist risk_score/at_risk_flag. Returns new at_risk_flag."""
    breaches = _count_sla_breaches(customer.customer_id, db)
    score = compute_risk_score(customer, breaches)
    customer.risk_score = score
    customer.at_risk_flag = score >= 50.0
    return customer.at_risk_flag


def update_csat_streak(customer: models.CSCustomer, new_rating: int) -> None:
    """Update consecutive_negative_csat counter after a CSAT response."""
    if new_rating <= 2:
        customer.consecutive_negative_csat += 1
    else:
        customer.consecutive_negative_csat = 0


def increment_ticket_frequency(customer: models.CSCustomer) -> None:
    """Increment the rolling 30-day ticket counter (recalculated daily by a job)."""
    customer.ticket_frequency_30d += 1
