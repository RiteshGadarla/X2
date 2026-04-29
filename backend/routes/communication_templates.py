from typing import List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import communication as comm_schemas

router = APIRouter()

@router.get("/")
def get_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.CSCommunicationTemplate).offset(skip).limit(limit).all()

@router.get("/{template_id}")
def get_item(template_id: UUID, db: Session = Depends(get_db)):
    item = db.query(models.CSCommunicationTemplate).filter(models.CSCommunicationTemplate.template_id == template_id).first()
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/")
def create_item(item_in: dict, db: Session = Depends(get_db)):
    item = models.CSCommunicationTemplate(**item_in)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{template_id}")
def update_item(template_id: UUID, update_data: dict, db: Session = Depends(get_db)):
    item = db.query(models.CSCommunicationTemplate).filter(models.CSCommunicationTemplate.template_id == template_id).first()
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    for k, v in update_data.items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{template_id}")
def delete_item(template_id: UUID, db: Session = Depends(get_db)):
    item = db.query(models.CSCommunicationTemplate).filter(models.CSCommunicationTemplate.template_id == template_id).first()
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"status": "deleted"}
