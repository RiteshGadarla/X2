from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
import models
from schemas import communication as comm_schemas

def create_log(db: Session, log_in: comm_schemas.CommunicationCreate) -> models.CSCommunicationLog:
    db_log = models.CSCommunicationLog(**log_in.model_dump())
    
    # Redact sensitive info if PII is detected (Mock logic)
    if "credit card" in db_log.content.lower() or "password" in db_log.content.lower():
        db_log.pii_redacted = True
        db_log.content = "[REDACTED SENSITIVE DATA]"
        
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_logs_by_ticket(db: Session, ticket_id: UUID) -> List[models.CSCommunicationLog]:
    return db.query(models.CSCommunicationLog).filter(
        models.CSCommunicationLog.ticket_id == ticket_id
    ).order_by(models.CSCommunicationLog.created_at.asc()).all()
