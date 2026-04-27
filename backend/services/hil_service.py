"""
HIL (Human-in-the-Loop) evaluation and review creation.

Trigger rules (deterministic):
  1. ticket_type in (billing, legal)     → HIL-3
  2. customer.is_vip == True             → HIL-3
  3. sentiment_label == "angry"          → HIL-3
  4. P1/P2 SLA breach (either clock)     → HIL-3
  5. priority == P1                      → HIL-4 (critical escalation)
  6. KB article awaiting publication     → HIL-5 (called explicitly)
  7. New channel/config before activate  → HIL-1 (called explicitly)
"""

from typing import Optional, Tuple
from sqlalchemy.orm import Session
import models


def evaluate_hil(
    ticket: models.CSTicket,
    customer: models.CSCustomer,
) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Returns (requires_hil, checkpoint_type, trigger_reason).
    Caller must commit after calling create_hil_review.
    """
    if ticket.ticket_type in ("billing", "legal"):
        return True, "HIL-3", ticket.ticket_type

    if customer.is_vip:
        return True, "HIL-3", "vip"

    if ticket.sentiment_label == "angry":
        return True, "HIL-3", "angry_sentiment"

    if ticket.priority in ("P1", "P2") and (
        ticket.sla_first_response_breached or ticket.sla_resolution_breached
    ):
        return True, "HIL-3", "sla_breach"

    if ticket.priority == "P1":
        return True, "HIL-4", "critical_escalation"

    return False, None, None


def create_hil_review(
    ticket: models.CSTicket,
    customer: models.CSCustomer,
    db: Session,
    checkpoint_type: Optional[str] = None,
    trigger_reason: Optional[str] = None,
) -> Optional[models.CSHILReview]:
    """
    Evaluate whether HIL is needed; if so, create a pending review row.
    If checkpoint_type/trigger_reason are provided they override the evaluation.
    Returns None if HIL is not required.
    """
    if checkpoint_type and trigger_reason:
        requires = True
    else:
        requires, checkpoint_type, trigger_reason = evaluate_hil(ticket, customer)

    if not requires:
        return None

    # Do not create duplicate pending reviews for the same ticket+trigger
    existing = (
        db.query(models.CSHILReview)
        .filter(
            models.CSHILReview.ticket_id == ticket.ticket_id,
            models.CSHILReview.trigger_reason == trigger_reason,
            models.CSHILReview.status == "pending",
        )
        .first()
    )
    if existing:
        return existing

    review = models.CSHILReview(
        ticket_id=ticket.ticket_id,
        checkpoint_type=checkpoint_type,
        trigger_reason=trigger_reason,
        status="pending",
    )
    db.add(review)
    ticket.hil_required = True
    ticket.hil_trigger_reason = trigger_reason
    return review
