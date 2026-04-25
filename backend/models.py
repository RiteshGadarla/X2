from sqlalchemy import Column, String, Integer, Text, UniqueConstraint, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from database import Base


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


class HILQueue(Base):
    __tablename__ = "hil_queue"

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
    avg_hil_turnaround = Column(String(20))
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
    author_type = Column(String(20), nullable=False)  # "customer" | "agent"
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
