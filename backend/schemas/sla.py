from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from schemas.enums import CustomerTier, PriorityLevel, AlertType


class SLAConfigCreate(BaseModel):
    customer_tier: CustomerTier
    priority: PriorityLevel
    first_response_minutes: int
    resolution_hours: int
    warning_threshold_pct: int = 75
    critical_threshold_pct: int = 90

    @field_validator("first_response_minutes", "resolution_hours")
    @classmethod
    def positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("must be a positive integer")
        return v

    @field_validator("warning_threshold_pct", "critical_threshold_pct")
    @classmethod
    def pct_range(cls, v: int) -> int:
        if not (1 <= v <= 100):
            raise ValueError("percentage must be between 1 and 100")
        return v


class SLAConfigUpdate(BaseModel):
    first_response_minutes: Optional[int] = None
    resolution_hours: Optional[int] = None
    warning_threshold_pct: Optional[int] = None
    critical_threshold_pct: Optional[int] = None
    is_active: Optional[bool] = None


class SLAConfigResponse(BaseModel):
    sla_config_id: UUID
    customer_tier: str
    priority: str
    first_response_minutes: int
    resolution_hours: int
    warning_threshold_pct: int
    critical_threshold_pct: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SLAAlertResponse(BaseModel):
    alert_id: UUID
    ticket_id: UUID
    alert_type: str
    sla_type: str
    threshold_pct: Optional[int]
    triggered_at: datetime
    acknowledged_at: Optional[datetime]
    acknowledged_by: Optional[UUID]

    model_config = {"from_attributes": True}


class SLAAlertAcknowledge(BaseModel):
    acknowledged_by: UUID
