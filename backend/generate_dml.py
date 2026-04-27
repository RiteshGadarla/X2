import json
import uuid
from mock_data import (
    ROLES, ROLE_PERMISSIONS, MOCK_METRICS, MOCK_TICKETS,
    MOCK_HIL_QUEUE, MOCK_KB_STATS, MOCK_VOC, MOCK_CHANNEL_VOL,
    MOCK_LEGAL_OVERVIEW, MOCK_CUSTOMER_PORTAL, MOCK_ACTIVITY_LOGS
)

def format_value(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (dict, list)):
        return "'" + json.dumps(v) + "'"
    # Escape single quotes
    return "'" + str(v).replace("'", "''") + "'"

def generate_dml():
    lines = []
    lines.append("-- DML for Legacy Tables\n")

    # Roles
    for role in ROLES:
        lines.append(f"INSERT INTO roles (id, name) VALUES ({format_value(role['id'])}, {format_value(role['name'])});")
    lines.append("")

    # Role Permissions
    for role_id, permissions in ROLE_PERMISSIONS.items():
        for perm in permissions:
            lines.append(f"INSERT INTO role_permissions (role_id, permission) VALUES ({format_value(role_id)}, {format_value(perm)});")
    lines.append("")

    # Metrics
    for role_id, data in MOCK_METRICS.items():
        lines.append(f"INSERT INTO metrics (role_id, data) VALUES ({format_value(role_id)}, {format_value(data)});")
    lines.append("")

    # Tickets (Legacy)
    for t in MOCK_TICKETS:
        cols = ", ".join(t.keys())
        vals = ", ".join(format_value(v) for v in t.values())
        lines.append(f"INSERT INTO tickets ({cols}) VALUES ({vals});")
    lines.append("")

    # HIL Queue (Legacy)
    for item in MOCK_HIL_QUEUE:
        cols = ", ".join(item.keys())
        vals = ", ".join(format_value(v) for v in item.values())
        lines.append(f"INSERT INTO hil_queue ({cols}) VALUES ({vals});")
    lines.append("")

    # KB Stats
    cols = ", ".join(MOCK_KB_STATS.keys())
    vals = ", ".join(format_value(v) for v in MOCK_KB_STATS.values())
    lines.append(f"INSERT INTO kb_stats ({cols}) VALUES ({vals});")
    lines.append("")

    # VOC
    lines.append(f"INSERT INTO voc (csat_trend, at_risk_count, feature_requests) VALUES ({format_value(MOCK_VOC['csat_trend'])}, {format_value(MOCK_VOC['at_risk_count'])}, {format_value(MOCK_VOC['feature_requests'])});")
    lines.append("")

    # Channel Volume
    cols = ", ".join(MOCK_CHANNEL_VOL.keys())
    vals = ", ".join(format_value(v) for v in MOCK_CHANNEL_VOL.values())
    lines.append(f"INSERT INTO channel_volume ({cols}) VALUES ({vals});")
    lines.append("")

    # Legal Overview
    cols = ", ".join(MOCK_LEGAL_OVERVIEW.keys())
    vals = ", ".join(format_value(v) for v in MOCK_LEGAL_OVERVIEW.values())
    lines.append(f"INSERT INTO legal_overview ({cols}) VALUES ({vals});")
    lines.append("")

    # Customer Portal
    cols = ", ".join(MOCK_CUSTOMER_PORTAL.keys())
    vals = ", ".join(format_value(v) for v in MOCK_CUSTOMER_PORTAL.values())
    lines.append(f"INSERT INTO customer_portal ({cols}) VALUES ({vals});")
    lines.append("")

    # Activity Logs
    for log in MOCK_ACTIVITY_LOGS:
        cols = ", ".join(log.keys())
        vals = ", ".join(format_value(v) for v in log.values())
        lines.append(f"INSERT INTO activity_logs ({cols}) VALUES ({vals});")
    
    lines.append("\n-- DML for New CS Tables\n")

    # CS User
    admin_id = "9c4cae89-004d-45fe-b6ba-2ab767ed418c" # Fixed for consistency
    lines.append(f"INSERT INTO cs_users (user_id, name, email, role) VALUES ('{admin_id}', 'Admin Agent', 'admin@csagent.io', 'admin') ON CONFLICT (email) DO NOTHING;")
    lines.append("")

    # CS Customers mapping
    customer_map = {}
    for mock_ticket in MOCK_TICKETS:
        c_name = mock_ticket["customer"]
        if c_name not in customer_map:
            c_id = str(uuid.uuid4())
            customer_map[c_name] = c_id
            tier = mock_ticket["tier"].lower()
            email = "contact@" + c_name.replace(" ", "").lower() + ".com"
            lines.append(f"INSERT INTO cs_customers (customer_id, name, email, account_tier) VALUES ('{c_id}', {format_value(c_name)}, {format_value(email)}, {format_value(tier)}) ON CONFLICT (email) DO NOTHING;")
    lines.append("")

    # CS SLA Configs (Note: DDL already has seeds, but we can add more if needed)
    # The DDL uses ON CONFLICT DO NOTHING, so this is safe.
    lines.append("-- SLA Configs already handled in DDL seed\n")

    # CS Incidents
    incident_id = str(uuid.uuid4())
    lines.append(f"INSERT INTO cs_incidents (incident_id, external_incident_id, title, description, status, severity, source_system) VALUES ('{incident_id}', 'INC-1001', 'EU Cluster Timeout', 'Major network latency in EU-Central-1', 'resolved', 'major', 'sre_agent') ON CONFLICT (external_incident_id) DO NOTHING;")
    lines.append("")

    # CS KB Articles
    kb_article_id = str(uuid.uuid4())
    lines.append(f"INSERT INTO cs_kb_articles (article_id, title, content, product_area, ticket_type, status) VALUES ('{kb_article_id}', 'Configuring SAML for Azure AD', 'Full content for Configuring SAML for Azure AD', 'Authentication', 'access', 'published');")
    lines.append(f"INSERT INTO cs_kb_articles (article_id, title, content, product_area, ticket_type, status) VALUES ('{str(uuid.uuid4())}', 'Optimizing Batch Processors', 'Full content for Optimizing Batch Processors', 'Infrastructure', 'performance', 'published');")
    lines.append("")

    # CS Tickets & HIL
    first_ticket_id = None
    first_customer_id = None
    for mock_ticket in MOCK_TICKETS:
        c_id = customer_map[mock_ticket["customer"]]
        t_id = str(uuid.uuid4())
        if first_ticket_id is None:
            first_ticket_id = t_id
            first_customer_id = c_id
        
        status_map = {
            "In Progress": "in_progress",
            "Routed": "routed",
            "Ack": "acknowledged",
            "In Triage": "in_triage",
            "Pending Customer": "pending_customer",
            "Resolution Proposed": "resolution_proposed"
        }
        mapped_status = status_map.get(mock_ticket["status"], "new")
        
        sentiment_map = {
            "Angry": "angry",
            "Frustrated": "negative",
            "Neutral": "neutral"
        }
        mapped_sentiment = sentiment_map.get(mock_ticket["sentiment"], "neutral")
        
        hil_required = False
        trigger_reason = "NULL"
        if "hil legal" in mock_ticket["status"].lower():
            hil_required = True
            trigger_reason = "'legal'"
            mapped_status = "new"

        # Correcting column names based on DDL
        # DDL: ticket_id, external_ticket_id, customer_id, ticket_type, priority, status, source_channel, title, description, ...
        # DDL has linked_incident_id
        
        l_inc_id = "NULL"
        if mock_ticket['summary'] == 'Payment Gateway Timeout in EU cluster':
            l_inc_id = "'" + incident_id + "'"

        lines.append(f"INSERT INTO cs_tickets (ticket_id, customer_id, title, description, ticket_type, priority, status, source_channel, account_tier, sentiment_label, hil_required, hil_trigger_reason, linked_incident_id) VALUES ('{t_id}', '{c_id}', {format_value(mock_ticket['summary'])}, {format_value('Auto-generated mock description for: ' + mock_ticket['summary'])}, 'bug', {format_value(mock_ticket['priority'])}, {format_value(mapped_status)}, 'portal', {format_value(mock_ticket['tier'].lower())}, {format_value(mapped_sentiment)}, {format_value(hil_required)}, {trigger_reason}, {l_inc_id});")
        
        if hil_required:
            h_id = str(uuid.uuid4())
            lines.append(f"INSERT INTO cs_hil_reviews (hil_id, ticket_id, checkpoint_type, trigger_reason, status) VALUES ('{h_id}', '{t_id}', 'HIL-1', 'legal', 'pending');")

        # Communication Log (Outbound)
        comm_id = str(uuid.uuid4())
        lines.append(f"INSERT INTO cs_communication_logs (comm_id, ticket_id, channel, direction, content, sender_type) VALUES ('{comm_id}', '{t_id}', 'portal', 'outbound', 'Thank you for your report. We are looking into it.', 'agent_ai');")

    lines.append("")
    # CS KB Ticket Link
    if first_ticket_id:
        lines.append(f"INSERT INTO cs_kb_article_tickets (article_id, ticket_id) VALUES ('{kb_article_id}', '{first_ticket_id}');")

    # CS CSAT Survey
    if first_ticket_id and first_customer_id:
        lines.append(f"INSERT INTO cs_csat_surveys (csat_id, ticket_id, customer_id, rating, feedback_text) VALUES ('{str(uuid.uuid4())}', '{first_ticket_id}', '{first_customer_id}', 5, 'Great support!');")

    # CS SLA Alert
    if first_ticket_id:
        lines.append(f"INSERT INTO cs_sla_alerts (alert_id, ticket_id, alert_type, sla_type, threshold_pct) VALUES ('{str(uuid.uuid4())}', '{first_ticket_id}', 'warning', 'first_response', 75);")

    with open("DML.sql", "w") as f:
        f.write("\n".join(lines))
    
    print("DML.sql generated successfully!")

if __name__ == "__main__":
    generate_dml()
