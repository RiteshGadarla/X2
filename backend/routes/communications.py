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
