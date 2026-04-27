from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    external_incident_id: Optional[str] = None
    status: Optional[str] = None
    affected_product_area: Optional[str] = None
    severity: Optional[str] = None
    source_system: Optional[str] = None  # sre_agent | jira | servicenow | manual

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be blank")
        return v.strip()


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    affected_product_area: Optional[str] = None
    severity: Optional[str] = None


class IncidentStatusUpdate(BaseModel):
    status: str


class IncidentResponse(BaseModel):
    incident_id: UUID
    external_incident_id: Optional[str]
    title: str
    description: Optional[str]
    status: Optional[str]
    affected_product_area: Optional[str]
    severity: Optional[str]
    source_system: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
