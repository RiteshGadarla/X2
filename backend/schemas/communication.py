from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from schemas.enums import ChannelType, DirectionType, SenderType


class CommunicationCreate(BaseModel):
    ticket_id: UUID
    channel: ChannelType
    direction: DirectionType
    content: str
    content_type: str = "text"       # text | html | template
    template_id: Optional[str] = None
    sender_type: SenderType
    sender_id: Optional[UUID] = None  # null for customer or AI-generated
    pii_redacted: bool = False


class CommunicationDeliveryUpdate(BaseModel):
    delivery_confirmed: bool
    delivery_timestamp: Optional[datetime] = None


class CommunicationResponse(BaseModel):
    comm_id: UUID
    ticket_id: UUID
    channel: str
    direction: str
    content: str
    content_type: str
    template_id: Optional[str]
    sender_type: str
    sender_id: Optional[UUID]
    delivery_confirmed: bool
    delivery_timestamp: Optional[datetime]
    pii_redacted: bool
    created_at: datetime

    model_config = {"from_attributes": True}
