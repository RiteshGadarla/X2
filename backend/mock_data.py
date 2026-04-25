ROLES = [
    {"id": "SUPPORT_AGENT", "name": "Support Agent"},
    {"id": "SUPPORT_MANAGER", "name": "Support Manager"},
    {"id": "VP_CUSTOMER_SUCCESS", "name": "VP Customer Success"},
    {"id": "LEGAL_COMPLIANCE", "name": "Legal / Compliance"},
    {"id": "ADMIN_OPS", "name": "Admin / Ops"},
    {"id": "CUSTOMER", "name": "Customer (External Portal)"}
]

ROLE_PERMISSIONS = {
    "SUPPORT_AGENT": ["VIEW_TICKETS", "VIEW_SLA", "VIEW_HIL_STATUS", "DRAFT_KB"],
    "SUPPORT_MANAGER": ["VIEW_TICKETS", "VIEW_SLA", "VIEW_HIL_STATUS", "DRAFT_KB", "MANAGE_AGENT_CONFIG", "APPROVE_HIL", "PUBLISH_KB", "VIEW_SENTIMENT", "VIEW_VOC"],
    "VP_CUSTOMER_SUCCESS": ["APPROVE_HIL_OVERRIDE", "VIEW_EXEC_DASH", "VIEW_VOC", "VIEW_HIL_STATUS", "VIEW_SLA"],
    "LEGAL_COMPLIANCE": ["VIEW_LEGAL_TICKETS", "MANAGE_LEGAL_CORRESPONDENCE", "VIEW_HIL_STATUS", "VIEW_KB"],
    "ADMIN_OPS": ["MANAGE_INTEGRATIONS", "VIEW_CHANNEL_VOL", "MANAGE_AGENT_CONFIG"],
    "CUSTOMER": ["VIEW_CUSTOMER_PORTAL", "SUBMIT_CUSTOMER_TICKET", "VIEW_TICKET_STATUS"]
}

MOCK_METRICS = {
    "SUPPORT_AGENT": {
        "tickets_resolved_today": 42,
        "sla_compliance_rate": "94%",
        "pending_hil_reviews": 3,
        "avg_response_time": "12m",
        "description": "Your focus is closing tickets and maintaining immediate SLAs."
    },
    "SUPPORT_MANAGER": {
        "team_active_tickets": 156,
        "team_sla_compliance": "91%",
        "escalations_pending": 12,
        "csat_score": "4.6/5",
        "description": "Your focus is team throughput and addressing critical escalations."
    },
    "VP_CUSTOMER_SUCCESS": {
        "global_csat_trend": "+0.2%",
        "at_risk_customers": 8,
        "critical_sla_breaches": 2,
        "total_revenue_protected": "$1.2M",
        "description": "Your focus is overarching customer health and platform VoC insights."
    },
    "LEGAL_COMPLIANCE": {
        "active_legal_disputes": 4,
        "compliance_flags_today": 1,
        "avg_resolution_days": "18d",
        "pending_correspondence": 6,
        "description": "Your focus is mitigating legal risk and responding to compliance flags."
    },
    "ADMIN_OPS": {
        "active_integrations": 8,
        "failed_webhook_events": 2,
        "system_uptime": "99.99%",
        "total_channel_volume": "1,402",
        "description": "Your focus is system health and operational availability."
    },
    "CUSTOMER": {
        "open_tickets": 3,
        "resolved_this_month": 7,
        "avg_first_response": "27m",
        "customer_satisfaction": "4.4/5",
        "description": "Track ticket progress, get proactive updates, and request human support when needed."
    }
}

MOCK_TICKETS = [
    {"id": "TCK-9901", "customer": "Acme Corp", "tier": "Enterprise", "summary": "Payment Gateway Timeout in EU cluster", "time_remaining": "1h 12m", "status": "In Progress", "priority": "P1", "sentiment": "Angry"},
    {"id": "TCK-9902", "customer": "Globex", "tier": "Business", "summary": "How to export CSV with historical data", "time_remaining": "14h", "status": "Routed", "priority": "P3", "sentiment": "Neutral"},
    {"id": "TCK-9903", "customer": "Initech", "tier": "Standard", "summary": "Login API returns HTTP 500 on MFA fallback", "time_remaining": "4h 30m", "status": "Ack", "priority": "P2", "sentiment": "Frustrated"},
    {"id": "LGL-104", "customer": "Soylent", "tier": "Enterprise", "summary": "GDPR data deletion and audit evidence request", "time_remaining": "2d", "status": "HIL Legal", "priority": "P1", "sentiment": "Neutral"},
    {"id": "TCK-9904", "customer": "Hooli", "tier": "Enterprise", "summary": "Production latency spikes after rollout", "time_remaining": "22m", "status": "In Progress", "priority": "P1", "sentiment": "Angry"},
    {"id": "TCK-9905", "customer": "Vehement Capital", "tier": "Business", "summary": "Unable to add new SSO metadata certificate", "time_remaining": "2h 05m", "status": "In Triage", "priority": "P2", "sentiment": "Frustrated"},
    {"id": "TCK-9906", "customer": "Massive Dynamic", "tier": "Enterprise", "summary": "Invoice PDF contains wrong tax code", "time_remaining": "6h", "status": "Routed", "priority": "P2", "sentiment": "Neutral"},
    {"id": "TCK-9907", "customer": "Umbrella", "tier": "Standard", "summary": "Webhook retries do not trigger after timeout", "time_remaining": "16h", "status": "Ack", "priority": "P3", "sentiment": "Neutral"},
    {"id": "TCK-9908", "customer": "Wonka Industries", "tier": "Business", "summary": "Bulk import fails at row 1200 with parser error", "time_remaining": "8h 20m", "status": "In Progress", "priority": "P2", "sentiment": "Frustrated"},
    {"id": "TCK-9909", "customer": "Stark Industries", "tier": "Enterprise", "summary": "Role sync missing permissions from SCIM", "time_remaining": "1d 4h", "status": "Pending Customer", "priority": "P3", "sentiment": "Neutral"},
    {"id": "TCK-9910", "customer": "Wayne Enterprises", "tier": "Enterprise", "summary": "Fraud alert rules not applied to new accounts", "time_remaining": "38m", "status": "In Progress", "priority": "P1", "sentiment": "Angry"},
    {"id": "TCK-9911", "customer": "Tyrell Corp", "tier": "Business", "summary": "SLA report email missing weekly attachment", "time_remaining": "5h 10m", "status": "In Triage", "priority": "P2", "sentiment": "Neutral"},
    {"id": "TCK-9912", "customer": "Oceanic", "tier": "Standard", "summary": "Account lockout policy unclear to end users", "time_remaining": "18h", "status": "Resolution Proposed", "priority": "P4", "sentiment": "Neutral"},
    {"id": "TCK-9913", "customer": "Cyberdyne", "tier": "Enterprise", "summary": "Critical batch job delayed and data stale", "time_remaining": "52m", "status": "Routed", "priority": "P1", "sentiment": "Frustrated"},
    {"id": "TCK-9914", "customer": "Nakatomi", "tier": "Business", "summary": "MFA SMS delivery failure for APAC users", "time_remaining": "3h", "status": "In Progress", "priority": "P2", "sentiment": "Frustrated"},
    {"id": "TCK-9915", "customer": "Pied Piper", "tier": "Standard", "summary": "API docs mismatch actual request schema", "time_remaining": "20h", "status": "Ack", "priority": "P3", "sentiment": "Neutral"},
    {"id": "TCK-9916", "customer": "Aperture", "tier": "Enterprise", "summary": "Contracted uptime clause breach dispute", "time_remaining": "1h 40m", "status": "HIL Legal", "priority": "P1", "sentiment": "Angry"},
    {"id": "TCK-9917", "customer": "Monarch", "tier": "Business", "summary": "Channel integration disconnect in Teams bot", "time_remaining": "7h", "status": "In Triage", "priority": "P2", "sentiment": "Neutral"},
    {"id": "TCK-9918", "customer": "Gekko & Co", "tier": "Enterprise", "summary": "Refund commitment requested during outage", "time_remaining": "35m", "status": "HIL Legal", "priority": "P1", "sentiment": "Angry"},
    {"id": "TCK-9919", "customer": "Initrode", "tier": "Standard", "summary": "Portal attachment upload fails over 20MB", "time_remaining": "11h", "status": "Routed", "priority": "P3", "sentiment": "Neutral"},
    {"id": "TCK-9920", "customer": "Oscorp", "tier": "Business", "summary": "Customer portal AI disclosure not shown", "time_remaining": "2h 15m", "status": "In Progress", "priority": "P2", "sentiment": "Frustrated"}
]

MOCK_HIL_QUEUE = [
    {"id": "HIL-301", "ticket_id": "TCK-9901", "checkpoint_type": "VIP Interaction", "age": "45m", "customer_tier": "Enterprise"},
    {"id": "HIL-302", "ticket_id": "TCK-9908", "checkpoint_type": "Billing Dispute", "age": "2h", "customer_tier": "Business"},
    {"id": "HIL-303", "ticket_id": "LGL-104", "checkpoint_type": "Legal Correspondence", "age": "1d", "customer_tier": "Enterprise"},
    {"id": "HIL-304", "ticket_id": "TCK-9910", "checkpoint_type": "VIP Interaction", "age": "30m", "customer_tier": "Enterprise"},
    {"id": "HIL-305", "ticket_id": "TCK-9916", "checkpoint_type": "Legal Correspondence", "age": "3h 20m", "customer_tier": "Enterprise"},
    {"id": "HIL-306", "ticket_id": "TCK-9918", "checkpoint_type": "Billing Dispute", "age": "1h 05m", "customer_tier": "Enterprise"},
    {"id": "HIL-307", "ticket_id": "TCK-9904", "checkpoint_type": "VIP Interaction", "age": "50m", "customer_tier": "Enterprise"},
    {"id": "HIL-308", "ticket_id": "TCK-9914", "checkpoint_type": "Billing Dispute", "age": "2h 40m", "customer_tier": "Business"}
]

MOCK_KB_STATS = {
    "usage_rate": "42%",
    "success_rate": "89%",
    "drafts_pending": 4,
    "top_gap": "SSO Azure AD Integration"
}

MOCK_VOC = {
    "csat_trend": "4.2/5",
    "at_risk_count": 5,
    "feature_requests": [
        {"area": "Reporting Dashboard", "frequency": 142},
        {"area": "SSO Providers", "frequency": 89},
        {"area": "API Rate Limits", "frequency": 45}
    ]
}

MOCK_CHANNEL_VOL = {
    "email": 450,
    "chat": 320,
    "slack": 115,
    "portal": 200,
    "whatsapp": 50,
    "peak_hour": "14:00 GMT"
}

MOCK_LEGAL_OVERVIEW = {
    "active_cases": 11,
    "pending_approvals": 6,
    "blocked_comms": 3,
    "avg_hil_turnaround": "3h 20m",
    "weekly_flags": [
        {"day": "Mon", "flags": 2},
        {"day": "Tue", "flags": 1},
        {"day": "Wed", "flags": 3},
        {"day": "Thu", "flags": 2},
        {"day": "Fri", "flags": 2},
        {"day": "Sat", "flags": 1},
        {"day": "Sun", "flags": 1}
    ],
    "case_breakdown": [
        {"name": "Legal", "value": 45, "color": "#DC2626"},
        {"name": "Privacy", "value": 30, "color": "#E4902E"},
        {"name": "Compliance", "value": 25, "color": "#5929d0"}
    ]
}

MOCK_CUSTOMER_PORTAL = {
    "product_areas": ["Payments", "Authentication", "Reporting", "Integrations"],
    "issue_types": ["Bug", "Enhancement Request", "Access Issue", "Performance Issue", "Billing/Account"],
    "tickets": [
        {"id": "CUST-2201", "summary": "Export report missing filters", "status": "In Progress", "sla_target": "4h response, 24h resolution"},
        {"id": "CUST-2202", "summary": "Unable to reset MFA after device change", "status": "Pending Customer", "sla_target": "1h response, 8h resolution"},
        {"id": "CUST-2203", "summary": "Webhook retries delayed", "status": "In Triage", "sla_target": "15m response, 4h resolution"}
    ],
    "linked_kb": [
        {"title": "How to configure report filters in exports", "tag": "Reporting"},
        {"title": "MFA recovery and identity verification workflow", "tag": "Authentication"},
        {"title": "Webhook retry diagnostics checklist", "tag": "Integrations"}
    ]
}
<<<<<<< HEAD
=======

MOCK_ACTIVITY_LOGS = [
    {
        "id": "LOG-1042",
        "time": "09:42",
        "severity": "success",
        "source": "SLA Monitor",
        "message": "P1 first-response window recovered for Acme Corp.",
        "role_scope": "Support"
    },
    {
        "id": "LOG-1041",
        "time": "09:36",
        "severity": "warning",
        "source": "HIL Queue",
        "message": "VIP checkpoint waiting 45m for manager approval.",
        "role_scope": "Manager"
    },
    {
        "id": "LOG-1040",
        "time": "09:28",
        "severity": "info",
        "source": "Ticket Intake",
        "message": "12 new omnichannel tickets normalized and triaged.",
        "role_scope": "Support"
    },
    {
        "id": "LOG-1039",
        "time": "09:17",
        "severity": "error",
        "source": "Integration",
        "message": "Zendesk webhook retry failed on channel sync batch.",
        "role_scope": "Admin"
    },
    {
        "id": "LOG-1038",
        "time": "09:04",
        "severity": "info",
        "source": "VoC Engine",
        "message": "Recurring reporting export theme linked to 8 tickets.",
        "role_scope": "Executive"
    },
    {
        "id": "LOG-1037",
        "time": "08:52",
        "severity": "warning",
        "source": "Compliance",
        "message": "Legal phrase detected in draft customer response.",
        "role_scope": "Legal"
    },
    {
        "id": "LOG-1036",
        "time": "08:41",
        "severity": "success",
        "source": "Knowledge Base",
        "message": "SSO recovery article moved to publication review.",
        "role_scope": "Support"
    }
]
>>>>>>> master
