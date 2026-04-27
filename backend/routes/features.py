import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import (
    Ticket, HILQueue, KBStats, VOC,
    ChannelVolume, LegalOverview, CustomerPortal, ActivityLog,
    TicketUpdate,
)
from services.ticket_utils import enrich_ticket_sort_fields

router = APIRouter()


class TicketSubmitRequest(BaseModel):
    customer: str
    summary: str
    tier: str = "standard"
    priority: str = "P3"
    channel: str = "portal"


class TicketUpdateRequest(BaseModel):
    author: str
    author_type: str  # "customer" | "agent"
    message: str


@router.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):
    rows = db.query(Ticket).all()
    tickets = [
        {
            "id": t.id, "customer": t.customer, "tier": t.tier,
            "summary": t.summary, "time_remaining": t.time_remaining,
            "status": t.status, "priority": t.priority, "sentiment": t.sentiment,
        }
        for t in rows
    ]
    enriched = [enrich_ticket_sort_fields(t) for t in tickets]
    sorted_tickets = sorted(
        enriched,
        key=lambda t: (
            t["sla_priority_rank"],
            t["priority_rank"],
            t["customer_tier_rank"],
            t["time_remaining_minutes"],
            t["id"],
        ),
    )
    return {"tickets": sorted_tickets}


@router.get("/hil")
def get_hil_queue(db: Session = Depends(get_db)):
    rows = db.query(HILQueue).all()
    return {
        "queue": [
            {
                "id": h.id, "ticket_id": h.ticket_id,
                "checkpoint_type": h.checkpoint_type,
                "age": h.age, "customer_tier": h.customer_tier,
            }
            for h in rows
        ]
    }


@router.get("/kb")
def get_kb_stats(db: Session = Depends(get_db)):
    kb = db.query(KBStats).first()
    if not kb:
        return {
            "usage_rate": "0%",
            "success_rate": "0%",
            "drafts_pending": 0,
            "top_gap": "None",
        }
    return {
        "usage_rate": kb.usage_rate,
        "success_rate": kb.success_rate,
        "drafts_pending": kb.drafts_pending,
        "top_gap": kb.top_gap,
    }


@router.get("/voc")
def get_voc(db: Session = Depends(get_db)):
    voc = db.query(VOC).first()
    if not voc:
        return {
            "csat_trend": "0/5",
            "at_risk_count": 0,
            "feature_requests": [],
        }
    return {
        "csat_trend": voc.csat_trend,
        "at_risk_count": voc.at_risk_count,
        "feature_requests": voc.feature_requests,
    }


@router.get("/channels")
def get_channels(db: Session = Depends(get_db)):
    cv = db.query(ChannelVolume).first()
    if not cv:
        return {
            "email": 0, "chat": 0, "slack": 0,
            "portal": 0, "whatsapp": 0, "peak_hour": "N/A",
        }
    return {
        "email": cv.email, "chat": cv.chat, "slack": cv.slack,
        "portal": cv.portal, "whatsapp": cv.whatsapp, "peak_hour": cv.peak_hour,
    }


@router.get("/legal-overview")
def get_legal_overview(db: Session = Depends(get_db)):
    lo = db.query(LegalOverview).first()
    if not lo:
        return {
            "active_cases": 0,
            "pending_approvals": 0,
            "blocked_comms": 0,
            "avg_hil_turnaround": "0h",
            "weekly_flags": [],
            "case_breakdown": [],
        }
    return {
        "active_cases": lo.active_cases,
        "pending_approvals": lo.pending_approvals,
        "blocked_comms": lo.blocked_comms,
        "avg_hil_turnaround": lo.avg_hil_turnaround,
        "weekly_flags": lo.weekly_flags,
        "case_breakdown": lo.case_breakdown,
    }


@router.get("/customer-portal")
def get_customer_portal(db: Session = Depends(get_db)):
    cp = db.query(CustomerPortal).first()
    if not cp:
        return {
            "product_areas": [],
            "issue_types": [],
            "tickets": [],
            "linked_kb": [],
        }
    return {
        "product_areas": cp.product_areas,
        "issue_types": cp.issue_types,
        "tickets": cp.tickets,
        "linked_kb": cp.linked_kb,
    }


@router.get("/logs")
def get_activity_logs(db: Session = Depends(get_db)):
    rows = db.query(ActivityLog).order_by(ActivityLog.id.desc()).all()
    return {
        "logs": [
            {
                "id": l.id, "time": l.time, "severity": l.severity,
                "source": l.source, "message": l.message, "role_scope": l.role_scope,
            }
            for l in rows
        ]
    }


@router.post("/tickets/submit", status_code=201)
def submit_ticket(body: TicketSubmitRequest, db: Session = Depends(get_db)):
    ticket_id = f"TKT-{uuid.uuid4().hex[:6].upper()}"
    ticket = Ticket(
        id=ticket_id,
        customer=body.customer,
        tier=body.tier,
        summary=body.summary,
        time_remaining="4h 0m",
        status="open",
        priority=body.priority,
        sentiment="neutral",
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {
        "id": ticket.id,
        "customer": ticket.customer,
        "tier": ticket.tier,
        "summary": ticket.summary,
        "status": ticket.status,
        "priority": ticket.priority,
        "sentiment": ticket.sentiment,
        "time_remaining": ticket.time_remaining,
    }


@router.get("/tickets/{ticket_id}/updates")
def get_ticket_updates(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    rows = (
        db.query(TicketUpdate)
        .filter(TicketUpdate.ticket_id == ticket_id)
        .order_by(TicketUpdate.created_at)
        .all()
    )
    return {
        "ticket_id": ticket_id,
        "updates": [
            {
                "id": u.id,
                "author": u.author,
                "author_type": u.author_type,
                "message": u.message,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in rows
        ],
    }


@router.post("/tickets/{ticket_id}/updates", status_code=201)
def add_ticket_update(ticket_id: str, body: TicketUpdateRequest, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if body.author_type not in ("customer", "agent"):
        raise HTTPException(status_code=422, detail="author_type must be 'customer' or 'agent'")
    update = TicketUpdate(
        ticket_id=ticket_id,
        author=body.author,
        author_type=body.author_type,
        message=body.message,
    )
    db.add(update)
    db.commit()
    db.refresh(update)
    return {
        "id": update.id,
        "ticket_id": update.ticket_id,
        "author": update.author,
        "author_type": update.author_type,
        "message": update.message,
        "created_at": update.created_at.isoformat() if update.created_at else None,
    }
