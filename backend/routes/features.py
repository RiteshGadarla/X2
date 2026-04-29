import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import (
    Ticket, ReviewQueue, KBStats, VOC,
    ChannelVolume, LegalOverview, CustomerPortal, ActivityLog,
    TicketUpdate, CSReport, CSNote
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


class ActivityLogCreateRequest(BaseModel):
    severity: str = "info"
    source: str = "System"
    message: str
    role_scope: str = "System"


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


@router.get("/legal-overview")
def get_legal_overview(db: Session = Depends(get_db)):
    lo = db.query(LegalOverview).first()
    if not lo:
        return {
            "active_cases": 0,
            "pending_approvals": 0,
            "blocked_comms": 0,
            "avg_review_turnaround": "0h",
            "weekly_flags": [],
            "case_breakdown": [],
        }
    return {
        "active_cases": lo.active_cases,
        "pending_approvals": lo.pending_approvals,
        "blocked_comms": lo.blocked_comms,
        "avg_review_turnaround": lo.avg_review_turnaround,
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


@router.get("/channels")
def get_channel_volume(db: Session = Depends(get_db)):
    cv = db.query(ChannelVolume).first()
    if not cv:
        return {
            "email": 0,
            "chat": 0,
            "slack": 0,
            "portal": 0,
            "whatsapp": 0,
            "peak_hour": "N/A",
        }
    return {
        "email": cv.email,
        "chat": cv.chat,
        "slack": cv.slack,
        "portal": cv.portal,
        "whatsapp": cv.whatsapp,
        "peak_hour": cv.peak_hour,
    }


@router.get("/tickets")
def get_all_tickets(db: Session = Depends(get_db)):
    rows = db.query(Ticket).all()
    return {
        "tickets": [
            {
                "id": t.id,
                "customer": t.customer,
                "tier": t.tier,
                "summary": t.summary,
                "time_remaining": t.time_remaining,
                "status": t.status,
                "priority": t.priority,
                "sentiment": t.sentiment,
            }
            for t in rows
        ]
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


from datetime import datetime

@router.post("/logs", status_code=201)
def create_activity_log(body: ActivityLogCreateRequest, db: Session = Depends(get_db)):
    timestamp = int(datetime.now().timestamp())
    log_id = f"LZ-{timestamp}-{uuid.uuid4().hex[:4].upper()}"
    current_time = datetime.now().strftime("%H:%M")
    
    new_log = ActivityLog(
        id=log_id,
        time=current_time,
        severity=body.severity,
        source=body.source,
        message=body.message,
        role_scope=body.role_scope
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return {
        "id": new_log.id,
        "time": new_log.time,
        "severity": new_log.severity,
        "source": new_log.source,
        "message": new_log.message,
        "role_scope": new_log.role_scope
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

class GenerateReportRequest(BaseModel):
    report_type: str = "weekly_summary"

@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    rows = db.query(CSReport).order_by(CSReport.generated_at.desc()).all()
    return {
        "reports": [
            {
                "id": str(r.report_id),
                "type": r.report_type,
                "period_start": r.period_start.isoformat(),
                "period_end": r.period_end.isoformat(),
                "data": r.data,
                "generated_at": r.generated_at.isoformat(),
            }
            for r in rows
        ]
    }

@router.post("/reports/generate")
def generate_report(req: GenerateReportRequest, db: Session = Depends(get_db)):
    import datetime
    
    end_date = datetime.datetime.now(datetime.timezone.utc)
    start_date = end_date - datetime.timedelta(days=7)
    
    import random
    mock_data = {
        "total_tickets": random.randint(100, 300),
        "resolved_tickets": random.randint(80, 200),
        "avg_resolution_time_hrs": round(random.uniform(2.5, 8.5), 1),
        "csat_score": round(random.uniform(4.0, 5.0), 1)
    }
    
    new_report = CSReport(
        report_type=req.report_type,
        period_start=start_date,
        period_end=end_date,
        data=mock_data,
        generated_by="system"
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return {
        "id": str(new_report.report_id),
        "type": new_report.report_type,
        "period_start": new_report.period_start.isoformat(),
        "period_end": new_report.period_end.isoformat(),
        "data": new_report.data,
        "generated_at": new_report.generated_at.isoformat(),
    }

@router.delete("/reports")
def clear_reports(db: Session = Depends(get_db)):
    db.query(CSReport).delete()
    db.commit()
    return {"status": "cleared"}

class CreateNoteRequest(BaseModel):
    content: str

class UpdateNoteRequest(BaseModel):
    content: str

@router.get("/notes")
def get_notes(db: Session = Depends(get_db)):
    rows = db.query(CSNote).order_by(CSNote.created_at.desc()).all()
    return {
        "notes": [
            {
                "id": str(n.note_id),
                "content": n.content,
                "created_at": n.created_at.isoformat(),
                "updated_at": n.updated_at.isoformat(),
            }
            for n in rows
        ]
    }

@router.post("/notes")
def create_note(req: CreateNoteRequest, db: Session = Depends(get_db)):
    note = CSNote(content=req.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return {
        "id": str(note.note_id),
        "content": note.content,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
    }

@router.put("/notes/{note_id}")
def update_note(note_id: str, req: UpdateNoteRequest, db: Session = Depends(get_db)):
    note = db.query(CSNote).filter(CSNote.note_id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.content = req.content
    db.commit()
    db.refresh(note)
    return {
        "id": str(note.note_id),
        "content": note.content,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
    }

@router.delete("/notes/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    note = db.query(CSNote).filter(CSNote.note_id == note_id).first()
    if note:
        db.delete(note)
        db.commit()
    return {"status": "deleted"}

