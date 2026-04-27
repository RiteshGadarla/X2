from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import incident as incident_schemas
from services import incident_service

router = APIRouter()

@router.post("/", response_model=incident_schemas.IncidentResponse)
def create_incident(incident_in: incident_schemas.IncidentCreate, db: Session = Depends(get_db)):
    return incident_service.create_incident(db, incident_in)

@router.get("/", response_model=List[incident_schemas.IncidentResponse])
def get_incidents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return incident_service.get_incidents(db, skip=skip, limit=limit)

@router.get("/{incident_id}", response_model=incident_schemas.IncidentResponse)
def get_incident(incident_id: UUID, db: Session = Depends(get_db)):
    incident = incident_service.get_incident(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.patch("/{incident_id}", response_model=incident_schemas.IncidentResponse)
def update_incident(incident_id: UUID, update_data: incident_schemas.IncidentUpdate, db: Session = Depends(get_db)):
    try:
        return incident_service.update_incident(db, incident_id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
