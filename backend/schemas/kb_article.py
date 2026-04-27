from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator
from schemas.enums import KBStatus, TicketType


class KBArticleCreate(BaseModel):
    title: str
    content: str
    product_area: Optional[str] = None
    ticket_type: Optional[TicketType] = None
    source_ticket_ids: List[UUID] = []
    created_by: Optional[UUID] = None

    @field_validator("title", "content")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("field must not be blank")
        return v.strip()


class KBArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    product_area: Optional[str] = None
    ticket_type: Optional[TicketType] = None


class KBArticleStatusUpdate(BaseModel):
    status: KBStatus
    reviewed_by: Optional[UUID] = None


class KBArticleResponse(BaseModel):
    article_id: UUID
    title: str
    content: str
    product_area: Optional[str]
    ticket_type: Optional[str]
    status: str
    usage_count: int
    resolution_success_count: int
    resolution_failure_count: int
    created_by: Optional[UUID]
    reviewed_by: Optional[UUID]
    published_at: Optional[datetime]
    archived_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
