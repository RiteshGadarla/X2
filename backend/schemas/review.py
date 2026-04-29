from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from schemas.enums import ReviewCheckpoint, ReviewTriggerReason, ReviewStatus


class ReviewCreate(BaseModel):
    ticket_id: UUID
    checkpoint_type: ReviewCheckpoint
    trigger_reason: ReviewTriggerReason


class ReviewAction(BaseModel):
    status: ReviewStatus
    reviewer_id: UUID
    comments: Optional[str] = None
    action_taken: Optional[str] = None


class ReviewResponse(BaseModel):
    review_id: UUID
    ticket_id: UUID
    checkpoint_type: str
    trigger_reason: str
    status: str
    reviewer_id: Optional[UUID]
    reviewed_at: Optional[datetime]
    comments: Optional[str]
    action_taken: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
