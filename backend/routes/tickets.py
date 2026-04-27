from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import ticket as ticket_schemas
from services import ticket_service

router = APIRouter()

@router.post("/", response_model=ticket_schemas.TicketResponse)
def create_ticket(ticket_in: ticket_schemas.TicketCreate, db: Session = Depends(get_db)):
    try:
        return ticket_service.create_ticket(db, ticket_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[ticket_schemas.TicketResponse])
def get_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return ticket_service.get_tickets(db, skip=skip, limit=limit)

@router.get("/{ticket_id}", response_model=ticket_schemas.TicketResponse)
def get_ticket(ticket_id: UUID, db: Session = Depends(get_db)):
    ticket = ticket_service.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_id}/status", response_model=ticket_schemas.TicketResponse)
def update_ticket_status(ticket_id: UUID, status_update: ticket_schemas.TicketStatusUpdate, db: Session = Depends(get_db)):
    try:
        return ticket_service.update_ticket_status(db, ticket_id, status_update)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{ticket_id}/priority", response_model=ticket_schemas.TicketResponse)
def update_ticket_priority(ticket_id: UUID, priority_update: ticket_schemas.TicketPriorityUpdate, db: Session = Depends(get_db)):
    try:
        return ticket_service.update_priority(db, ticket_id, priority_update)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{ticket_id}/assign", response_model=ticket_schemas.TicketResponse)
def assign_ticket(ticket_id: UUID, assign_update: ticket_schemas.TicketAssign, db: Session = Depends(get_db)):
    try:
        return ticket_service.assign_ticket(db, ticket_id, assign_update)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
