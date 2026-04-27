from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import kb_article as kb_schemas
from services import kb_article_service

router = APIRouter()

@router.post("/", response_model=kb_schemas.KBArticleResponse)
def create_article(article_in: kb_schemas.KBArticleCreate, db: Session = Depends(get_db)):
    return kb_article_service.create_article(db, article_in)

@router.get("/", response_model=List[kb_schemas.KBArticleResponse])
def get_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return kb_article_service.get_articles(db, skip=skip, limit=limit)

@router.get("/{article_id}", response_model=kb_schemas.KBArticleResponse)
def get_article(article_id: UUID, db: Session = Depends(get_db)):
    article = kb_article_service.get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="KB Article not found")
    return article

@router.patch("/{article_id}/status", response_model=kb_schemas.KBArticleResponse)
def update_status(article_id: UUID, status_update: kb_schemas.KBArticleStatusUpdate, db: Session = Depends(get_db)):
    try:
        return kb_article_service.update_status(db, article_id, status_update.status, status_update.reviewer_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
