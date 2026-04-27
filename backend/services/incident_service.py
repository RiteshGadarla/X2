from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
import models
from schemas import incident as incident_schemas

def create_incident(db: Session, incident_in: incident_schemas.IncidentCreate) -> models.CSIncident:
    db_incident = models.CSIncident(**incident_in.model_dump())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

def get_incident(db: Session, incident_id: UUID) -> Optional[models.CSIncident]:
    return db.query(models.CSIncident).filter(models.CSIncident.incident_id == incident_id).first()

def get_incidents(db: Session, skip: int = 0, limit: int = 100) -> List[models.CSIncident]:
    return db.query(models.CSIncident).order_by(models.CSIncident.created_at.desc()).offset(skip).limit(limit).all()

def update_incident(db: Session, incident_id: UUID, update_data: incident_schemas.IncidentUpdate) -> models.CSIncident:
    incident = get_incident(db, incident_id)
    if not incident:
        raise ValueError("Incident not found")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(incident, key, value)
        
    db.commit()
    db.refresh(incident)
    return incident
