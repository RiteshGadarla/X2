from uuid import UUID
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, field_validator
from schemas.enums import ChannelType, TicketType, PriorityLevel, TicketStatus, SentimentLabel


class TicketCreate(BaseModel):
    customer_id: UUID
    source_channel: ChannelType
    title: str
    description: str
    affected_product_area: Optional[str] = None
    environment: Optional[str] = None
    error_messages: Optional[str] = None
    business_impact: Optional[str] = None
    attachments: List[Any] = []
    tags: List[str] = []

    # Optional triage hints (AI layer populates these; also accepted from trusted sources)
    ticket_type: Optional[TicketType] = None
    priority: Optional[PriorityLevel] = None
    sentiment_score: Optional[float] = None
    sentiment_label: Optional[SentimentLabel] = None
    triage_confidence: Optional[float] = None
    triage_rationale: Optional[str] = None

    # Priority calculation inputs (used by PriorityService when priority is not supplied)
    user_impact: Optional[str] = None          # all_users | many_users | single_user
    functionality_criticality: Optional[str] = None  # critical | major | minor

    ai_disclosure_acknowledged: bool = False

    @field_validator("title", "description")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("field must not be blank")
        return v.strip()


class TicketStatusUpdate(BaseModel):
    status: TicketStatus
    actor_id: Optional[str] = "system"
    comment: Optional[str] = None


class TicketAssign(BaseModel):
    assigned_to: Optional[UUID] = None
    assigned_agent_type: Optional[str] = None  # human | sre_agent | coding_agent | qa_agent | devops_agent


class TicketPriorityUpdate(BaseModel):
    priority: PriorityLevel
    rationale: Optional[str] = None


class TicketTriageUpdate(BaseModel):
    ticket_type: Optional[TicketType] = None
    priority: Optional[PriorityLevel] = None
    sentiment_score: Optional[float] = None
    sentiment_label: Optional[SentimentLabel] = None
    triage_confidence: Optional[float] = None
    triage_rationale: Optional[str] = None
    affected_product_area: Optional[str] = None


class TicketLinkDuplicate(BaseModel):
    master_ticket_id: UUID


class TicketLinkIncident(BaseModel):
    incident_id: UUID


class TicketResponse(BaseModel):
    ticket_id: UUID
    external_ticket_id: Optional[str]
    customer_id: UUID
    ticket_type: Optional[str]
    priority: Optional[str]
    status: str
    source_channel: str
    title: str
    description: str
    affected_product_area: Optional[str]
    environment: Optional[str]
    error_messages: Optional[str]
    business_impact: Optional[str]
    attachments: Optional[List[Any]]
    tags: Optional[List[Any]]
    sentiment_score: Optional[float]
    sentiment_label: Optional[str]
    triage_confidence: Optional[float]
    triage_rationale: Optional[str]
    account_tier: str
    sla_first_response_due: Optional[datetime]
    sla_resolution_due: Optional[datetime]
    first_responded_at: Optional[datetime]
    resolved_at: Optional[datetime]
    closed_at: Optional[datetime]
    sla_first_response_breached: bool
    sla_resolution_breached: bool
    assigned_to: Optional[UUID]
    assigned_agent_type: Optional[str]
    is_duplicate: bool
    master_ticket_id: Optional[UUID]
    linked_incident_id: Optional[UUID]
    hil_required: bool
    hil_trigger_reason: Optional[str]
    pii_detected: bool
    pii_redacted: bool
    ai_disclosure_acknowledged: bool
    kb_article_id: Optional[UUID]
    kb_resolution_proposed: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TicketSLAStatus(BaseModel):
    ticket_id: UUID
    first_response: dict
    resolution: dict
