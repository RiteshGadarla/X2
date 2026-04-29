from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import communication as comm_schemas
from services import communication_service

router = APIRouter()

@router.post("/", response_model=comm_schemas.CommunicationResponse)
def create_log(log_in: comm_schemas.CommunicationCreate, db: Session = Depends(get_db)):
    return communication_service.create_log(db, log_in)

@router.get("/ticket/{ticket_id}", response_model=List[comm_schemas.CommunicationResponse])
def get_ticket_logs(ticket_id: UUID, db: Session = Depends(get_db)):
    return communication_service.get_logs_by_ticket(db, ticket_id)

import models

@router.get("/", response_model=List[comm_schemas.CommunicationResponse])
def get_communications(ticket_id: UUID = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    q = db.query(models.CSCommunicationLog)
    if ticket_id:
        q = q.filter(models.CSCommunicationLog.ticket_id == ticket_id)
    return q.offset(skip).limit(limit).all()

@router.get("/{comm_id}", response_model=comm_schemas.CommunicationResponse)
def get_communication(comm_id: UUID, db: Session = Depends(get_db)):
    comm = db.query(models.CSCommunicationLog).filter(models.CSCommunicationLog.comm_id == comm_id).first()
    if not comm: raise HTTPException(status_code=404, detail="Communication not found")
    return comm

@router.put("/{comm_id}", response_model=comm_schemas.CommunicationResponse)
def update_communication(comm_id: UUID, update_data: dict, db: Session = Depends(get_db)):
    comm = db.query(models.CSCommunicationLog).filter(models.CSCommunicationLog.comm_id == comm_id).first()
    if not comm: raise HTTPException(status_code=404, detail="Communication not found")
    for k, v in update_data.items():
        setattr(comm, k, v)
    db.commit()
    db.refresh(comm)
    return comm

@router.delete("/{comm_id}")
def delete_communication(comm_id: UUID, db: Session = Depends(get_db)):
    comm = db.query(models.CSCommunicationLog).filter(models.CSCommunicationLog.comm_id == comm_id).first()
    if not comm: raise HTTPException(status_code=404, detail="Communication not found")
    db.delete(comm)
    db.commit()
    return {"status": "deleted"}
