from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import review as review_schemas
from services import review_service
import models

router = APIRouter()

@router.get("", response_model=List[review_schemas.ReviewResponse])
def get_pending_reviews(db: Session = Depends(get_db)):
    return review_service.get_pending_reviews(db)

@router.post("/{review_id}/action", response_model=review_schemas.ReviewResponse)
def perform_review_action(review_id: UUID, action_in: review_schemas.ReviewAction, db: Session = Depends(get_db)):
    try:
        return review_service.process_review_action(db, review_id, action_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{review_id}", response_model=review_schemas.ReviewResponse)
def get_review(review_id: UUID, db: Session = Depends(get_db)):
    review = db.query(models.CSReview).filter(models.CSReview.review_id == review_id).first()
    if not review: raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.post("", response_model=review_schemas.ReviewResponse)
def create_review(review_in: dict, db: Session = Depends(get_db)):
    review = models.CSReview(**review_in)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.put("/{review_id}", response_model=review_schemas.ReviewResponse)
def update_review(review_id: UUID, update_data: dict, db: Session = Depends(get_db)):
    review = db.query(models.CSReview).filter(models.CSReview.review_id == review_id).first()
    if not review: raise HTTPException(status_code=404, detail="Review not found")
    for k, v in update_data.items():
        setattr(review, k, v)
    db.commit()
    db.refresh(review)
    return review

@router.delete("/{review_id}")
def delete_review(review_id: UUID, db: Session = Depends(get_db)):
    review = db.query(models.CSReview).filter(models.CSReview.review_id == review_id).first()
    if not review: raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"status": "deleted"}

@router.patch("/{review_id}/action", response_model=review_schemas.ReviewResponse)
def patch_review_action(review_id: UUID, action_in: review_schemas.ReviewAction, db: Session = Depends(get_db)):
    try:
        return review_service.process_review_action(db, review_id, action_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
