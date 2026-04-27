from uuid import UUID
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel
from schemas.enums import ChannelType


class ChannelConfigCreate(BaseModel):
    channel: ChannelType
    config: dict = {}


class ChannelConfigUpdate(BaseModel):
    is_active: Optional[bool] = None
    config: Optional[dict] = None


class ChannelConfigActivate(BaseModel):
    validated_by: UUID


class ChannelConfigResponse(BaseModel):
    channel_config_id: UUID
    channel: str
    is_active: bool
    config: Any
    validated_by: Optional[UUID]
    validated_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TemplateCreate(BaseModel):
    name: str
    ticket_type: Optional[str] = None
    customer_tier: Optional[str] = None
    channel: Optional[str] = None
    subject: Optional[str] = None
    body: str
    variables: list = []


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    variables: Optional[list] = None
    is_active: Optional[bool] = None


class TemplateResponse(BaseModel):
    template_id: UUID
    name: str
    ticket_type: Optional[str]
    customer_tier: Optional[str]
    channel: Optional[str]
    subject: Optional[str]
    body: str
    variables: Any
    is_active: bool
    approved_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
