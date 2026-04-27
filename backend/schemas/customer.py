from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
from schemas.enums import CustomerTier


class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    account_tier: CustomerTier = CustomerTier.standard
    is_vip: bool = False
    ai_disclosure_acknowledged: bool = False

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("name must not be blank")
        return v.strip()


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    account_tier: Optional[CustomerTier] = None
    is_vip: Optional[bool] = None
    ai_disclosure_acknowledged: Optional[bool] = None


class CustomerResponse(BaseModel):
    customer_id: UUID
    name: str
    email: str
    phone: Optional[str]
    organization: Optional[str]
    account_tier: str
    is_vip: bool
    risk_score: float
    at_risk_flag: bool
    consecutive_negative_csat: int
    ticket_frequency_30d: int
    ai_disclosure_acknowledged: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
