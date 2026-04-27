from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import hil as hil_schemas
from services import hil_service

router = APIRouter()

@router.get("/", response_model=List[hil_schemas.HILReviewResponse])
def get_pending_hil_reviews(db: Session = Depends(get_db)):
    return hil_service.get_pending_reviews(db)

@router.post("/{hil_id}/action", response_model=hil_schemas.HILReviewResponse)
def perform_hil_action(hil_id: UUID, action_in: hil_schemas.HILReviewAction, db: Session = Depends(get_db)):
    try:
        return hil_service.process_hil_action(db, hil_id, action_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
