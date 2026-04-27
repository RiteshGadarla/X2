from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session
import models
from schemas import kb_article as kb_schemas

def create_article(db: Session, article_in: kb_schemas.KBArticleCreate) -> models.CSKBArticle:
    db_article = models.CSKBArticle(
        title=article_in.title,
        content=article_in.content,
        product_area=article_in.product_area,
        ticket_type=article_in.ticket_type,
        status="draft",
        created_by=article_in.created_by
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    
    if article_in.source_ticket_ids:
        for t_id in article_in.source_ticket_ids:
            link = models.CSKBArticleTicket(article_id=db_article.article_id, ticket_id=t_id)
            db.add(link)
        db.commit()
        
    return db_article

def get_article(db: Session, article_id: UUID) -> Optional[models.CSKBArticle]:
    return db.query(models.CSKBArticle).filter(models.CSKBArticle.article_id == article_id).first()

def get_articles(db: Session, skip: int = 0, limit: int = 100) -> List[models.CSKBArticle]:
    return db.query(models.CSKBArticle).order_by(models.CSKBArticle.created_at.desc()).offset(skip).limit(limit).all()

def update_status(db: Session, article_id: UUID, status: str, reviewer_id: Optional[UUID] = None) -> models.CSKBArticle:
    article = get_article(db, article_id)
    if not article:
        raise ValueError("KB Article not found")
    
    article.status = status
    if status == "published":
        article.published_at = datetime.now(timezone.utc)
        if reviewer_id:
            article.reviewed_by = reviewer_id
    elif status == "archived":
        article.archived_at = datetime.now(timezone.utc)
        
    db.commit()
    db.refresh(article)
    return article
