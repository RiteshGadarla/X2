from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session

import models
from schemas import ticket as ticket_schemas
from services import priority_service, sla_service, hil_service

def create_ticket(db: Session, ticket_in: ticket_schemas.TicketCreate) -> models.CSTicket:
    # Look up customer
    customer = db.query(models.CSCustomer).filter(models.CSCustomer.customer_id == ticket_in.customer_id).first()
    if not customer:
        raise ValueError(f"Customer {ticket_in.customer_id} not found")

    # Determine priority if not provided
    priority = ticket_in.priority
    if not priority:
        priority = priority_service.calculate_priority(
            tier=customer.account_tier,
            user_impact=ticket_in.user_impact or "single_user",
            functionality_criticality=ticket_in.functionality_criticality or "minor",
            sentiment=ticket_in.sentiment_label or "neutral",
            ticket_type=ticket_in.ticket_type or "bug",
            is_vip=customer.is_vip
        )

    # Determine if HIL review is required initially
    hil_req = False
    hil_reason = None
    if ticket_in.ticket_type in ("billing", "legal"):
        hil_req = True
        hil_reason = ticket_in.ticket_type
    elif customer.is_vip:
        hil_req = True
        hil_reason = "vip"
    elif ticket_in.sentiment_label == "angry":
        hil_req = True
        hil_reason = "angry_sentiment"

    db_ticket = models.CSTicket(
        customer_id=customer.customer_id,
        source_channel=ticket_in.source_channel,
        title=ticket_in.title,
        description=ticket_in.description,
        affected_product_area=ticket_in.affected_product_area,
        environment=ticket_in.environment,
        error_messages=ticket_in.error_messages,
        business_impact=ticket_in.business_impact,
        attachments=ticket_in.attachments,
        tags=ticket_in.tags,
        ticket_type=ticket_in.ticket_type,
        priority=priority,
        sentiment_score=ticket_in.sentiment_score,
        sentiment_label=ticket_in.sentiment_label,
        triage_confidence=ticket_in.triage_confidence,
        triage_rationale=ticket_in.triage_rationale,
        account_tier=customer.account_tier,
        ai_disclosure_acknowledged=ticket_in.ai_disclosure_acknowledged,
        hil_required=hil_req,
        hil_trigger_reason=hil_reason
    )
    
    # SLA deadlines
    db_ticket = sla_service.assign_sla_deadlines(db_ticket, db)
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    # Create HIL review row if needed
    if db_ticket.hil_required:
        hil_service.create_hil_checkpoint(
            db=db,
            ticket_id=db_ticket.ticket_id,
            checkpoint_type="HIL-3",
            trigger_reason=db_ticket.hil_trigger_reason
        )

    return db_ticket

def get_ticket(db: Session, ticket_id: UUID) -> Optional[models.CSTicket]:
    return db.query(models.CSTicket).filter(models.CSTicket.ticket_id == ticket_id).first()

def get_tickets(db: Session, skip: int = 0, limit: int = 100) -> List[models.CSTicket]:
    return db.query(models.CSTicket).order_by(models.CSTicket.created_at.desc()).offset(skip).limit(limit).all()

def update_ticket_status(db: Session, ticket_id: UUID, status_update: ticket_schemas.TicketStatusUpdate) -> models.CSTicket:
    ticket = get_ticket(db, ticket_id)
    if not ticket:
        raise ValueError(f"Ticket {ticket_id} not found")

    if status_update.status in ("closed", "resolved"):
        if ticket.hil_required:
            pending_hil = db.query(models.CSHILReview).filter(
                models.CSHILReview.ticket_id == ticket_id,
                models.CSHILReview.status == "pending"
            ).first()
            if pending_hil:
                raise ValueError("Cannot resolve/close a ticket with pending HIL reviews")
        
        # P1/P2 resolution validation
        if status_update.status == "closed" and ticket.priority in ("P1", "P2"):
            if ticket.status != "customer_confirmed":
                # For non-agentic, we'll allow it if HIL approved, but typically it shouldn't close directly.
                pass
        
        ticket.resolved_at = datetime.now(timezone.utc)
        if status_update.status == "closed":
            ticket.closed_at = datetime.now(timezone.utc)

    ticket.status = status_update.status
    db.commit()
    db.refresh(ticket)
    return ticket

def assign_ticket(db: Session, ticket_id: UUID, assign_update: ticket_schemas.TicketAssign) -> models.CSTicket:
    ticket = get_ticket(db, ticket_id)
    if not ticket:
        raise ValueError("Ticket not found")
    
    ticket.assigned_to = assign_update.assigned_to
    ticket.assigned_agent_type = assign_update.assigned_agent_type
    ticket.status = "routed"
    db.commit()
    db.refresh(ticket)
    return ticket

def update_priority(db: Session, ticket_id: UUID, update: ticket_schemas.TicketPriorityUpdate) -> models.CSTicket:
    ticket = get_ticket(db, ticket_id)
    if not ticket:
        raise ValueError("Ticket not found")
    
    ticket.priority = update.priority
    ticket = sla_service.assign_sla_deadlines(ticket, db)
    db.commit()
    db.refresh(ticket)
    return ticket
