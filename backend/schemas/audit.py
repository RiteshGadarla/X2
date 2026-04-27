from uuid import UUID
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    audit_id: UUID
    entity_type: str
    entity_id: str
    action: str
    actor_id: Optional[str]
    actor_type: str
    old_value: Optional[Any]
    new_value: Optional[Any]
    ip_address: Optional[str]
    timestamp: datetime

    model_config = {"from_attributes": True}
