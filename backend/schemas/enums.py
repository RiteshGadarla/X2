from enum import Enum


class ChannelType(str, Enum):
    email = "email"
    chat = "chat"
    portal = "portal"
    teams = "teams"
    slack = "slack"
    whatsapp = "whatsapp"
    phone = "phone"
    api = "api"


class TicketType(str, Enum):
    bug = "bug"
    enhancement = "enhancement"
    training = "training"
    access = "access"
    data = "data"
    performance = "performance"
    infrastructure = "infrastructure"
    billing = "billing"
    legal = "legal"


class PriorityLevel(str, Enum):
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"
    P4 = "P4"


class TicketStatus(str, Enum):
    new = "new"
    acknowledged = "acknowledged"
    in_triage = "in_triage"
    routed = "routed"
    in_progress = "in_progress"
    pending_customer = "pending_customer"
    resolution_proposed = "resolution_proposed"
    resolved = "resolved"
    customer_confirmed = "customer_confirmed"
    closed = "closed"


class CustomerTier(str, Enum):
    enterprise = "enterprise"
    business = "business"
    standard = "standard"


class SentimentLabel(str, Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"
    angry = "angry"


class HILCheckpoint(str, Enum):
    HIL_1 = "HIL-1"
    HIL_3 = "HIL-3"
    HIL_4 = "HIL-4"
    HIL_5 = "HIL-5"


class HILTriggerReason(str, Enum):
    billing = "billing"
    legal = "legal"
    vip = "vip"
    angry_sentiment = "angry_sentiment"
    sla_breach = "sla_breach"
    kb_publication = "kb_publication"
    config_review = "config_review"
    critical_escalation = "critical_escalation"


class HILStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    taken_ownership = "taken_ownership"
    modified = "modified"


class UserRole(str, Enum):
    support_agent = "support_agent"
    support_lead = "support_lead"
    support_manager = "support_manager"
    csm = "csm"
    vp_customer_success = "vp_customer_success"
    legal = "legal"
    admin = "admin"


class KBStatus(str, Enum):
    draft = "draft"
    pending_review = "pending_review"
    published = "published"
    archived = "archived"


class AlertType(str, Enum):
    warning = "warning"
    critical = "critical"
    breach = "breach"


class ReportType(str, Enum):
    daily_digest = "daily_digest"
    weekly_sla = "weekly_sla"
    weekly_csat = "weekly_csat"
    ticket_ageing = "ticket_ageing"
    monthly_voc = "monthly_voc"


class DirectionType(str, Enum):
    inbound = "inbound"
    outbound = "outbound"


class SenderType(str, Enum):
    customer = "customer"
    agent_ai = "agent_ai"
    human = "human"


# Valid ticket status transitions
VALID_TRANSITIONS: dict[str, list[str]] = {
    "new":                  ["acknowledged"],
    "acknowledged":         ["in_triage"],
    "in_triage":            ["routed", "pending_customer"],
    "routed":               ["in_progress"],
    "in_progress":          ["pending_customer", "resolution_proposed"],
    "pending_customer":     ["in_progress", "resolved"],
    "resolution_proposed":  ["resolved", "in_progress"],
    "resolved":             ["customer_confirmed", "in_progress"],
    "customer_confirmed":   ["closed"],
    "closed":               [],
}
