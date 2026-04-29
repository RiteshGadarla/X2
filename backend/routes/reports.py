from typing import List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import report as report_schemas

router = APIRouter()

@router.get("/")
def get_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.CSReport).offset(skip).limit(limit).all()

@router.get("/{report_id}")
def get_item(report_id: UUID, db: Session = Depends(get_db)):
    item = db.query(models.CSReport).filter(models.CSReport.report_id == report_id).first()
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/")
def create_item(item_in: dict, db: Session = Depends(get_db)):
    item = models.CSReport(**item_in)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{report_id}")
def update_item(report_id: UUID, update_data: dict, db: Session = Depends(get_db)):
    item = db.query(models.CSReport).filter(models.CSReport.report_id == report_id).first()
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    for k, v in update_data.items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{report_id}")
def delete_item(report_id: UUID, db: Session = Depends(get_db)):
    item = db.query(models.CSReport).filter(models.CSReport.report_id == report_id).first()
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"status": "deleted"}
