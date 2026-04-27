from uuid import UUID
from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel
from schemas.enums import ReportType


class ReportGenerateRequest(BaseModel):
    report_type: ReportType
    period_start: Optional[datetime] = None  # defaults to sensible window per type
    period_end: Optional[datetime] = None


class ReportResponse(BaseModel):
    report_id: UUID
    report_type: str
    period_start: datetime
    period_end: datetime
    data: Any
    generated_at: datetime
    generated_by: str

    model_config = {"from_attributes": True}
