"""
CSAT survey lifecycle: creation on ticket close, response recording,
and customer at-risk updates.
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Session
import models
from services import at_risk_service, audit_service


def dispatch_survey(ticket: models.CSTicket, db: Session) -> models.CSCSATSurvey:
    """Create and 'send' a CSAT survey when a ticket is closed."""
    existing = (
        db.query(models.CSCSATSurvey)
        .filter(models.CSCSATSurvey.ticket_id == ticket.ticket_id)
        .first()
    )
    if existing:
        return existing

    survey = models.CSCSATSurvey(
        ticket_id=ticket.ticket_id,
        customer_id=ticket.customer_id,
        sent_at=datetime.now(timezone.utc),
    )
    db.add(survey)
    audit_service.log_event(
        "csat_survey", str(ticket.ticket_id), "dispatched", db, actor_type="system"
    )
    return survey


def record_response(
    survey: models.CSCSATSurvey,
    rating: int,
    feedback_text: str,
    db: Session,
) -> models.CSCSATSurvey:
    """Persist a customer's CSAT rating and trigger at-risk evaluation."""
    if survey.responded_at:
        raise ValueError("Survey has already been responded to")
    if not (1 <= rating <= 5):
        raise ValueError("Rating must be between 1 and 5")

    survey.rating = rating
    survey.feedback_text = feedback_text
    survey.responded_at = datetime.now(timezone.utc)

    customer = (
        db.query(models.CSCustomer)
        .filter(models.CSCustomer.customer_id == survey.customer_id)
        .first()
    )
    if customer:
        at_risk_service.update_csat_streak(customer, rating)
        at_risk_service.refresh_customer_risk(customer, db)

    audit_service.log_event(
        "csat_survey", str(survey.csat_id), "responded",
        db, actor_type="system", new_value={"rating": rating}
    )
    return survey
