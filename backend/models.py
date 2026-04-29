import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime,
    ForeignKey, SmallInteger, UniqueConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from database import Base


# ─── Legacy mock models (dashboard UI) ───────────────────────────────────────

class Role(Base):
    __tablename__ = "roles"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)


class RolePermission(Base):
    __tablename__ = "role_permissions"
    __table_args__ = (UniqueConstraint("role_id", "permission"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    role_id = Column(String(50), nullable=False)
    permission = Column(String(100), nullable=False)


class Metric(Base):
    __tablename__ = "metrics"

    role_id = Column(String(50), primary_key=True)
    data = Column(JSONB, nullable=False)


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String(20), primary_key=True)
    customer = Column(String(100))
    tier = Column(String(20))
    summary = Column(Text)
    time_remaining = Column(String(20))
    status = Column(String(30))
    priority = Column(String(5))
    sentiment = Column(String(20))


class ReviewQueue(Base):
    __tablename__ = "review_queue"

    id = Column(String(20), primary_key=True)
    ticket_id = Column(String(20))
    checkpoint_type = Column(String(50))
    age = Column(String(20))
    customer_tier = Column(String(20))


class KBStats(Base):
    __tablename__ = "kb_stats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usage_rate = Column(String(10))
    success_rate = Column(String(10))
    drafts_pending = Column(Integer)
    top_gap = Column(String(100))


class VOC(Base):
    __tablename__ = "voc"

    id = Column(Integer, primary_key=True, autoincrement=True)
    csat_trend = Column(String(10))
    at_risk_count = Column(Integer)
    feature_requests = Column(JSONB)


class ChannelVolume(Base):
    __tablename__ = "channel_volume"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(Integer)
    chat = Column(Integer)
    slack = Column(Integer)
    portal = Column(Integer)
    whatsapp = Column(Integer)
    peak_hour = Column(String(20))


class LegalOverview(Base):
    __tablename__ = "legal_overview"

    id = Column(Integer, primary_key=True, autoincrement=True)
    active_cases = Column(Integer)
    pending_approvals = Column(Integer)
    blocked_comms = Column(Integer)
    avg_review_turnaround = Column(String(20))
    weekly_flags = Column(JSONB)
    case_breakdown = Column(JSONB)


class CustomerPortal(Base):
    __tablename__ = "customer_portal"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_areas = Column(JSONB)
    issue_types = Column(JSONB)
    tickets = Column(JSONB)
    linked_kb = Column(JSONB)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(20), primary_key=True)
    time = Column(String(10))
    severity = Column(String(20))
    source = Column(String(50))
    message = Column(Text)
    role_scope = Column(String(20))


class TicketUpdate(Base):
    __tablename__ = "ticket_updates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(String(20), nullable=False, index=True)
    author = Column(String(100), nullable=False)
    author_type = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ─── CSAgent production models ────────────────────────────────────────────────
# All tables use the "cs_" prefix to avoid collisions with legacy mock tables.

class CSUser(Base):
    __tablename__ = "cs_users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    # support_agent | support_lead | support_manager | csm | vp_customer_success | legal | admin
    role = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CSCustomer(Base):
    __tablename__ = "cs_customers"

    customer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(50))
    organization = Column(String(255))
    # enterprise | business | standard
    account_tier = Column(String(20), nullable=False, default="standard")
    is_vip = Column(Boolean, default=False)
    risk_score = Column(Float, default=0.0)
    at_risk_flag = Column(Boolean, default=False)
    consecutive_negative_csat = Column(Integer, default=0)
    ticket_frequency_30d = Column(Integer, default=0)
    ai_disclosure_acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CSSLAConfig(Base):
    __tablename__ = "cs_sla_configs"
    __table_args__ = (UniqueConstraint("customer_tier", "priority", name="uq_sla_tier_priority"),)

    sla_config_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # enterprise | business | standard
    customer_tier = Column(String(20), nullable=False)
    # P1 | P2 | P3 | P4
    priority = Column(String(5), nullable=False)
    first_response_minutes = Column(Integer, nullable=False)
    resolution_hours = Column(Integer, nullable=False)
    warning_threshold_pct = Column(Integer, nullable=False, default=75)
    critical_threshold_pct = Column(Integer, nullable=False, default=90)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CSIncident(Base):
    __tablename__ = "cs_incidents"

    incident_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_incident_id = Column(String(255), unique=True)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    status = Column(String(50))
    affected_product_area = Column(String(255))
    severity = Column(String(50))
    # sre_agent | jira | servicenow | manual
    source_system = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CSKBArticle(Base):
    __tablename__ = "cs_kb_articles"

    article_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    product_area = Column(String(255))
    # bug | enhancement | training | access | data | performance | infrastructure | billing | legal
    ticket_type = Column(String(50))
    # draft | pending_review | published | archived
    status = Column(String(20), nullable=False, default="draft")
    usage_count = Column(Integer, default=0)
    resolution_success_count = Column(Integer, default=0)
    resolution_failure_count = Column(Integer, default=0)
    created_by = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))
    published_at = Column(DateTime(timezone=True))
    archived_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CSTicket(Base):
    __tablename__ = "cs_tickets"

    ticket_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_ticket_id = Column(String(255))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("cs_customers.customer_id"), nullable=False)

    # Classification
    # bug | enhancement | training | access | data | performance | infrastructure | billing | legal
    ticket_type = Column(String(50))
    # P1 | P2 | P3 | P4
    priority = Column(String(5))
    # new | acknowledged | in_triage | routed | in_progress | pending_customer |
    # resolution_proposed | resolved | customer_confirmed | closed
    status = Column(String(30), nullable=False, default="new")
    # email | chat | portal | teams | slack | whatsapp | phone | api
    source_channel = Column(String(20), nullable=False)

    # Content
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    affected_product_area = Column(String(255))
    environment = Column(String(100))
    error_messages = Column(Text)
    business_impact = Column(Text)
    attachments = Column(JSONB, default=list)
    tags = Column(JSONB, default=list)

    # Triage metadata (populated by AI layer; readable by service layer)
    sentiment_score = Column(Float)
    # positive | neutral | negative | angry
    sentiment_label = Column(String(20))
    triage_confidence = Column(Float)
    triage_rationale = Column(Text)

    # SLA — denormalize tier at creation time so SLA is immutable for the ticket lifetime
    account_tier = Column(String(20), nullable=False)
    sla_first_response_due = Column(DateTime(timezone=True))
    sla_resolution_due = Column(DateTime(timezone=True))
    first_responded_at = Column(DateTime(timezone=True))
    resolved_at = Column(DateTime(timezone=True))
    closed_at = Column(DateTime(timezone=True))
    sla_first_response_breached = Column(Boolean, default=False)
    sla_resolution_breached = Column(Boolean, default=False)

    # Routing
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))
    # human | sre_agent | coding_agent | qa_agent | devops_agent | ba_agent | pm_agent
    assigned_agent_type = Column(String(50))

    # Duplicate detection
    is_duplicate = Column(Boolean, default=False)
    master_ticket_id = Column(UUID(as_uuid=True), ForeignKey("cs_tickets.ticket_id"))

    # Incident linkage
    linked_incident_id = Column(UUID(as_uuid=True), ForeignKey("cs_incidents.incident_id"))

    # Review flags
    review_required = Column(Boolean, default=False)
    # billing | legal | vip | angry_sentiment | sla_breach | critical_escalation
    review_trigger_reason = Column(String(50))

    # PII
    pii_detected = Column(Boolean, default=False)
    pii_redacted = Column(Boolean, default=False)

    # AI disclosure (mandatory for chat/portal channels)
    ai_disclosure_acknowledged = Column(Boolean, default=False)

    # KB resolution proposal
    kb_article_id = Column(UUID(as_uuid=True), ForeignKey("cs_kb_articles.article_id", use_alter=True, name="fk_ticket_kb_article"))
    kb_resolution_proposed = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# Indexes for common query patterns
Index("ix_cs_tickets_customer_id", CSTicket.customer_id)
Index("ix_cs_tickets_status", CSTicket.status)
Index("ix_cs_tickets_priority", CSTicket.priority)
Index("ix_cs_tickets_created_at", CSTicket.created_at)
Index("ix_cs_tickets_account_tier", CSTicket.account_tier)


class CSKBArticleTicket(Base):
    """Join table: which tickets sourced a KB article."""
    __tablename__ = "cs_kb_article_tickets"

    article_id = Column(UUID(as_uuid=True), ForeignKey("cs_kb_articles.article_id", ondelete="CASCADE"), primary_key=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("cs_tickets.ticket_id", ondelete="CASCADE"), primary_key=True)


class CSReview(Base):
    __tablename__ = "cs_reviews"

    review_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("cs_tickets.ticket_id"), nullable=False)
    # Review-1 | Review-3 | Review-4 | Review-5
    checkpoint_type = Column(String(10), nullable=False)
    # billing | legal | vip | angry_sentiment | sla_breach | kb_publication | config_review | critical_escalation
    trigger_reason = Column(String(50), nullable=False)
    # pending | approved | rejected | taken_ownership | modified
    status = Column(String(20), nullable=False, default="pending")
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))
    reviewed_at = Column(DateTime(timezone=True))
    comments = Column(Text)
    action_taken = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


Index("ix_cs_reviews_ticket_id", CSReview.ticket_id)
Index("ix_cs_reviews_status", CSReview.status)


class CSCommunicationLog(Base):
    __tablename__ = "cs_communication_logs"

    comm_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("cs_tickets.ticket_id"), nullable=False)
    # email | chat | portal | teams | slack | whatsapp | phone | api
    channel = Column(String(20), nullable=False)
    # inbound | outbound
    direction = Column(String(10), nullable=False)
    content = Column(Text, nullable=False)
    # text | html | template
    content_type = Column(String(20), default="text")
    template_id = Column(String(100))
    # customer | agent_ai | human
    sender_type = Column(String(20), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))
    delivery_confirmed = Column(Boolean, default=False)
    delivery_timestamp = Column(DateTime(timezone=True))
    pii_redacted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


Index("ix_cs_comm_logs_ticket_id", CSCommunicationLog.ticket_id)
Index("ix_cs_comm_logs_created_at", CSCommunicationLog.created_at)


class CSCSATSurvey(Base):
    __tablename__ = "cs_csat_surveys"

    csat_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("cs_tickets.ticket_id"), unique=True, nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("cs_customers.customer_id"), nullable=False)
    rating = Column(SmallInteger)  # 1–5; NULL until customer responds
    feedback_text = Column(Text)
    sent_at = Column(DateTime(timezone=True))
    responded_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


Index("ix_cs_csat_customer_id", CSCSATSurvey.customer_id)


class CSSLAAlert(Base):
    __tablename__ = "cs_sla_alerts"

    alert_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("cs_tickets.ticket_id"), nullable=False)
    # warning | critical | breach
    alert_type = Column(String(20), nullable=False)
    # first_response | resolution
    sla_type = Column(String(20), nullable=False)
    threshold_pct = Column(Integer)
    triggered_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True))
    acknowledged_by = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))


Index("ix_cs_sla_alerts_ticket_id", CSSLAAlert.ticket_id)


class CSAuditLog(Base):
    __tablename__ = "cs_audit_logs"

    audit_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(36), nullable=False)  # UUID stored as string for flexibility
    action = Column(String(100), nullable=False)
    actor_id = Column(String(255))
    # human | system
    actor_type = Column(String(20), nullable=False)
    old_value = Column(JSONB)
    new_value = Column(JSONB)
    ip_address = Column(String(50))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


Index("ix_cs_audit_entity", CSAuditLog.entity_type, CSAuditLog.entity_id)
Index("ix_cs_audit_timestamp", CSAuditLog.timestamp)


class CSReport(Base):
    __tablename__ = "cs_reports"

    report_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # daily_digest | weekly_sla | weekly_csat | ticket_ageing | monthly_voc
    report_type = Column(String(50), nullable=False)
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    data = Column(JSONB, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    # human | system
    generated_by = Column(String(20), default="system")


class CSNote(Base):
    __tablename__ = "cs_notes"
    
    note_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CSChannelConfig(Base):
    __tablename__ = "cs_channel_configs"

    channel_config_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # email | chat | portal | teams | slack | whatsapp | phone | api
    channel = Column(String(20), nullable=False, unique=True)
    is_active = Column(Boolean, default=False)
    config = Column(JSONB, nullable=False, default=dict)
    validated_by = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))
    validated_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CSCommunicationTemplate(Base):
    __tablename__ = "cs_communication_templates"

    template_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    ticket_type = Column(String(50))
    customer_tier = Column(String(20))
    channel = Column(String(20))
    subject = Column(String(500))
    body = Column(Text, nullable=False)
    variables = Column(JSONB, default=list)  # list of placeholder variable names
    is_active = Column(Boolean, default=True)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("cs_users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
