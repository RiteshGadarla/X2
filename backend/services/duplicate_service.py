"""
Rule-based duplicate ticket detection.

A potential duplicate is an open ticket that:
  - shares the same customer_id
  - shares the same affected_product_area (if both are set)
  - is not itself already marked as a duplicate
  - is not the ticket being evaluated
"""

from typing import List
from sqlalchemy import and_
from sqlalchemy.orm import Session
import models

_OPEN_STATUSES = (
    "new", "acknowledged", "in_triage", "routed",
    "in_progress", "pending_customer", "resolution_proposed",
)


def find_potential_duplicates(
    ticket: models.CSTicket, db: Session
) -> List[models.CSTicket]:
    filters = [
        models.CSTicket.customer_id == ticket.customer_id,
        models.CSTicket.status.in_(_OPEN_STATUSES),
        models.CSTicket.is_duplicate.is_(False),
        models.CSTicket.ticket_id != ticket.ticket_id,
    ]
    if ticket.affected_product_area:
        filters.append(
            models.CSTicket.affected_product_area == ticket.affected_product_area
        )
    return db.query(models.CSTicket).filter(and_(*filters)).all()


def link_as_duplicate(
    ticket: models.CSTicket,
    master: models.CSTicket,
    db: Session,
) -> models.CSTicket:
    if str(ticket.ticket_id) == str(master.ticket_id):
        raise ValueError("A ticket cannot be a duplicate of itself")
    if master.is_duplicate:
        raise ValueError("Master ticket is itself a duplicate; link to the original master")

    ticket.is_duplicate = True
    ticket.master_ticket_id = master.ticket_id
    ticket.status = "closed"
    return ticket
