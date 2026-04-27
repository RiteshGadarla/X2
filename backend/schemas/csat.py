from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class CSATSurveyCreate(BaseModel):
    ticket_id: UUID
    customer_id: UUID


class CSATSurveyResponse(BaseModel):
    csat_id: UUID
    ticket_id: UUID
    customer_id: UUID
    rating: Optional[int]
    feedback_text: Optional[str]
    sent_at: Optional[datetime]
    responded_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class CSATSurveySubmit(BaseModel):
    rating: int
    feedback_text: Optional[str] = None

    @field_validator("rating")
    @classmethod
    def rating_in_range(cls, v: int) -> int:
        if v < 1 or v > 5:
            raise ValueError("rating must be between 1 and 5")
        return v
