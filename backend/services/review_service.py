"""
Review evaluation and board creation.

Trigger rules (deterministic):
  1. ticket_type in (billing, legal)     → Review-3
  2. customer.is_vip == True             → Review-3
  3. sentiment_label == "angry"          → Review-3
  4. P1/P2 SLA breach (either clock)     → Review-3
  5. priority == P1                      → Review-4 (critical escalation)
  6. KB article awaiting publication     → Review-5 (called explicitly)
  7. New channel/config before activate  → Review-1 (called explicitly)
"""

from typing import Optional, Tuple
from sqlalchemy.orm import Session
import models


def evaluate_review(
    ticket: models.CSTicket,
    customer: models.CSCustomer,
) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Returns (requires_review, checkpoint_type, trigger_reason).
    Caller must commit after calling create_review.
    """
    if ticket.ticket_type in ("billing", "legal"):
        return True, "Review-3", ticket.ticket_type

    if customer.is_vip:
        return True, "Review-3", "vip"

    if ticket.sentiment_label == "angry":
        return True, "Review-3", "angry_sentiment"

    if ticket.priority in ("P1", "P2") and (
        ticket.sla_first_response_breached or ticket.sla_resolution_breached
    ):
        return True, "Review-3", "sla_breach"

    if ticket.priority == "P1":
        return True, "Review-4", "critical_escalation"

    return False, None, None


def create_review(
    ticket: models.CSTicket,
    customer: models.CSCustomer,
    db: Session,
    checkpoint_type: Optional[str] = None,
    trigger_reason: Optional[str] = None,
) -> Optional[models.CSReview]:
    """
    Evaluate whether Review is needed; if so, create a pending review row.
    If checkpoint_type/trigger_reason are provided they override the evaluation.
    Returns None if Review is not required.
    """
    if checkpoint_type and trigger_reason:
        requires = True
    else:
        requires, checkpoint_type, trigger_reason = evaluate_review(ticket, customer)

    if not requires:
        return None

    # Do not create duplicate pending reviews for the same ticket+trigger
    existing = (
        db.query(models.CSReview)
        .filter(
            models.CSReview.ticket_id == ticket.ticket_id,
            models.CSReview.trigger_reason == trigger_reason,
            models.CSReview.status == "pending",
        )
        .first()
    )
    if existing:
        return existing

    review = models.CSReview(
        ticket_id=ticket.ticket_id,
        checkpoint_type=checkpoint_type,
        trigger_reason=trigger_reason,
        status="pending",
    )
    db.add(review)
    ticket.review_required = True
    ticket.review_trigger_reason = trigger_reason
    return review

def get_pending_reviews(db: Session):
    return db.query(models.CSReview).filter(models.CSReview.status == "pending").all()

def process_review_action(db: Session, review_id, action_in):
    from datetime import datetime
    review = db.query(models.CSReview).filter(models.CSReview.review_id == review_id).first()
    if not review:
        raise ValueError("Review not found")
    
    review.status = action_in.status
    review.reviewer_id = action_in.reviewer_id
    review.comments = action_in.comments
    review.action_taken = action_in.action_taken
    review.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(review)
    return review
