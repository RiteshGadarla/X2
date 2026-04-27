-- =============================================================================
-- X2 Dashboard – PostgreSQL DML (Data Manipulation Language)
-- Robust seeding script with idempotency (ON CONFLICT)
-- =============================================================================

-- ─── 1. Roles ───────────────────────────────────────────────────────────────
INSERT INTO roles (id, name) VALUES 
('SUPPORT_LEAD', 'Support Lead'),
('SUPPORT_MANAGER', 'Support Manager'),
('VP_CUSTOMER_SUCCESS', 'VP Customer Success'),
('LEGAL_COMPLIANCE', 'Legal / Compliance'),
('ADMIN_OPS', 'Admin / Ops'),
('CUSTOMER', 'Customer (External Portal)')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ─── 2. Role Permissions ─────────────────────────────────────────────────────
INSERT INTO role_permissions (role_id, permission) VALUES 
('SUPPORT_LEAD', 'VIEW_TICKETS'),
('SUPPORT_LEAD', 'VIEW_SLA'),
('SUPPORT_LEAD', 'VIEW_HIL_STATUS'),
('SUPPORT_LEAD', 'DRAFT_KB'),
('SUPPORT_MANAGER', 'VIEW_TICKETS'),
('SUPPORT_MANAGER', 'VIEW_SLA'),
('SUPPORT_MANAGER', 'VIEW_HIL_STATUS'),
('SUPPORT_MANAGER', 'DRAFT_KB'),
('SUPPORT_MANAGER', 'MANAGE_AGENT_CONFIG'),
('SUPPORT_MANAGER', 'APPROVE_HIL'),
('SUPPORT_MANAGER', 'PUBLISH_KB'),
('SUPPORT_MANAGER', 'VIEW_SENTIMENT'),
('SUPPORT_MANAGER', 'VIEW_VOC'),
('VP_CUSTOMER_SUCCESS', 'APPROVE_HIL_OVERRIDE'),
('VP_CUSTOMER_SUCCESS', 'VIEW_EXEC_DASH'),
('VP_CUSTOMER_SUCCESS', 'VIEW_VOC'),
('VP_CUSTOMER_SUCCESS', 'VIEW_HIL_STATUS'),
('VP_CUSTOMER_SUCCESS', 'VIEW_SLA'),
('LEGAL_COMPLIANCE', 'VIEW_LEGAL_TICKETS'),
('LEGAL_COMPLIANCE', 'MANAGE_LEGAL_CORRESPONDENCE'),
('LEGAL_COMPLIANCE', 'VIEW_HIL_STATUS'),
('LEGAL_COMPLIANCE', 'VIEW_KB'),
('ADMIN_OPS', 'MANAGE_INTEGRATIONS'),
('ADMIN_OPS', 'VIEW_CHANNEL_VOL'),
('ADMIN_OPS', 'MANAGE_AGENT_CONFIG'),
('CUSTOMER', 'VIEW_CUSTOMER_PORTAL'),
('CUSTOMER', 'SUBMIT_CUSTOMER_TICKET'),
('CUSTOMER', 'VIEW_TICKET_STATUS')
ON CONFLICT (role_id, permission) DO NOTHING;

-- ─── 3. Metrics ──────────────────────────────────────────────────────────────
INSERT INTO metrics (role_id, data) VALUES 
('SUPPORT_LEAD', '{"tickets_resolved_today": 42, "sla_compliance_rate": "94%", "pending_hil_reviews": 3, "avg_response_time": "12m", "description": "Your focus is closing tickets and maintaining immediate SLAs."}'),
('SUPPORT_MANAGER', '{"team_active_tickets": 156, "team_sla_compliance": "91%", "escalations_pending": 12, "csat_score": "4.6/5", "description": "Your focus is team throughput and addressing critical escalations."}'),
('VP_CUSTOMER_SUCCESS', '{"global_csat_trend": "+0.2%", "at_risk_customers": 8, "critical_sla_breaches": 2, "total_revenue_protected": "$1.2M", "description": "Your focus is overarching customer health and platform VoC insights."}'),
('LEGAL_COMPLIANCE', '{"active_legal_disputes": 4, "compliance_flags_today": 1, "avg_resolution_days": "18d", "pending_correspondence": 6, "description": "Your focus is mitigating legal risk and responding to compliance flags."}'),
('ADMIN_OPS', '{"active_integrations": 8, "failed_webhook_events": 2, "system_uptime": "99.99%", "total_channel_volume": "1,402", "description": "Your focus is system health and operational availability."}'),
('CUSTOMER', '{"open_tickets": 3, "resolved_this_month": 7, "avg_first_response": "27m", "customer_satisfaction": "4.4/5", "description": "Track ticket progress, get proactive updates, and request human support when needed."}')
ON CONFLICT (role_id) DO UPDATE SET data = EXCLUDED.data;

-- ─── 4. Legacy Tickets ───────────────────────────────────────────────────────
INSERT INTO tickets (id, customer, tier, summary, time_remaining, status, priority, sentiment) VALUES 
('TCK-9901', 'Acme Corp', 'Enterprise', 'Payment Gateway Timeout in EU cluster', '1h 12m', 'In Progress', 'P1', 'Angry'),
('TCK-9902', 'Globex', 'Business', 'How to export CSV with historical data', '14h', 'Routed', 'P3', 'Neutral'),
('TCK-9903', 'Initech', 'Standard', 'Login API returns HTTP 500 on MFA fallback', '4h 30m', 'Ack', 'P2', 'Frustrated'),
('LGL-104', 'Soylent', 'Enterprise', 'GDPR data deletion and audit evidence request', '2d', 'HIL Legal', 'P1', 'Neutral'),
('TCK-9904', 'Hooli', 'Enterprise', 'Production latency spikes after rollout', '22m', 'In Progress', 'P1', 'Angry'),
('TCK-9905', 'Vehement Capital', 'Business', 'Unable to add new SSO metadata certificate', '2h 05m', 'In Triage', 'P2', 'Frustrated'),
('TCK-9906', 'Massive Dynamic', 'Enterprise', 'Invoice PDF contains wrong tax code', '6h', 'Routed', 'P2', 'Neutral'),
('TCK-9907', 'Umbrella', 'Standard', 'Webhook retries do not trigger after timeout', '16h', 'Ack', 'P3', 'Neutral'),
('TCK-9908', 'Wonka Industries', 'Business', 'Bulk import fails at row 1200 with parser error', '8h 20m', 'In Progress', 'P2', 'Frustrated'),
('TCK-9909', 'Stark Industries', 'Enterprise', 'Role sync missing permissions from SCIM', '1d 4h', 'Pending Customer', 'P3', 'Neutral'),
('TCK-9910', 'Wayne Enterprises', 'Enterprise', 'Fraud alert rules not applied to new accounts', '38m', 'In Progress', 'P1', 'Angry'),
('TCK-9911', 'Tyrell Corp', 'Business', 'SLA report email missing weekly attachment', '5h 10m', 'In Triage', 'P2', 'Neutral'),
('TCK-9912', 'Oceanic', 'Standard', 'Account lockout policy unclear to end users', '18h', 'Resolution Proposed', 'P4', 'Neutral'),
('TCK-9913', 'Cyberdyne', 'Enterprise', 'Critical batch job delayed and data stale', '52m', 'Routed', 'P1', 'Frustrated'),
('TCK-9914', 'Nakatomi', 'Business', 'MFA SMS delivery failure for APAC users', '3h', 'In Progress', 'P2', 'Frustrated'),
('TCK-9915', 'Pied Piper', 'Standard', 'API docs mismatch actual request schema', '20h', 'Ack', 'P3', 'Neutral'),
('TCK-9916', 'Aperture', 'Enterprise', 'Contracted uptime clause breach dispute', '1h 40m', 'HIL Legal', 'P1', 'Angry'),
('TCK-9917', 'Monarch', 'Business', 'Channel integration disconnect in Teams bot', '7h', 'In Triage', 'P2', 'Neutral'),
('TCK-9918', 'Gekko & Co', 'Enterprise', 'Refund commitment requested during outage', '35m', 'HIL Legal', 'P1', 'Angry'),
('TCK-9919', 'Initrode', 'Standard', 'Portal attachment upload fails over 20MB', '11h', 'Routed', 'P3', 'Neutral'),
('TCK-9920', 'Oscorp', 'Business', 'Customer portal AI disclosure not shown', '2h 15m', 'In Progress', 'P2', 'Frustrated')
ON CONFLICT (id) DO UPDATE SET 
    customer = EXCLUDED.customer,
    tier = EXCLUDED.tier,
    summary = EXCLUDED.summary,
    time_remaining = EXCLUDED.time_remaining,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    sentiment = EXCLUDED.sentiment;

-- ─── 5. HIL Queue ────────────────────────────────────────────────────────────
INSERT INTO hil_queue (id, ticket_id, checkpoint_type, age, customer_tier) VALUES 
('HIL-301', 'TCK-9901', 'VIP Interaction', '45m', 'Enterprise'),
('HIL-302', 'TCK-9908', 'Billing Dispute', '2h', 'Business'),
('HIL-303', 'LGL-104', 'Legal Correspondence', '1d', 'Enterprise'),
('HIL-304', 'TCK-9910', 'VIP Interaction', '30m', 'Enterprise'),
('HIL-305', 'TCK-9916', 'Legal Correspondence', '3h 20m', 'Enterprise'),
('HIL-306', 'TCK-9918', 'Billing Dispute', '1h 05m', 'Enterprise'),
('HIL-307', 'TCK-9904', 'VIP Interaction', '50m', 'Enterprise'),
('HIL-308', 'TCK-9914', 'Billing Dispute', '2h 40m', 'Business')
ON CONFLICT (id) DO UPDATE SET
    ticket_id = EXCLUDED.ticket_id,
    checkpoint_type = EXCLUDED.checkpoint_type,
    age = EXCLUDED.age,
    customer_tier = EXCLUDED.customer_tier;

-- ─── 6. Singleton / Dashboard Feature Tables ─────────────────────────────────
-- We use id=1 to ensure singleton pattern
INSERT INTO kb_stats (id, usage_rate, success_rate, drafts_pending, top_gap) 
VALUES (1, '42%', '89%', 4, 'SSO Azure AD Integration')
ON CONFLICT (id) DO UPDATE SET
    usage_rate = EXCLUDED.usage_rate,
    success_rate = EXCLUDED.success_rate,
    drafts_pending = EXCLUDED.drafts_pending,
    top_gap = EXCLUDED.top_gap;

INSERT INTO voc (id, csat_trend, at_risk_count, feature_requests) 
VALUES (1, '4.2/5', 5, '[{"area": "Reporting Dashboard", "frequency": 142}, {"area": "SSO Providers", "frequency": 89}, {"area": "API Rate Limits", "frequency": 45}]')
ON CONFLICT (id) DO UPDATE SET
    csat_trend = EXCLUDED.csat_trend,
    at_risk_count = EXCLUDED.at_risk_count,
    feature_requests = EXCLUDED.feature_requests;

INSERT INTO channel_volume (id, email, chat, slack, portal, whatsapp, peak_hour) 
VALUES (1, 450, 320, 115, 200, 50, '14:00 GMT')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    chat = EXCLUDED.chat,
    slack = EXCLUDED.slack,
    portal = EXCLUDED.portal,
    whatsapp = EXCLUDED.whatsapp,
    peak_hour = EXCLUDED.peak_hour;

INSERT INTO legal_overview (id, active_cases, pending_approvals, blocked_comms, avg_hil_turnaround, weekly_flags, case_breakdown) 
VALUES (1, 11, 6, 3, '3h 20m', '[{"day": "Mon", "flags": 2}, {"day": "Tue", "flags": 1}, {"day": "Wed", "flags": 3}, {"day": "Thu", "flags": 2}, {"day": "Fri", "flags": 2}, {"day": "Sat", "flags": 1}, {"day": "Sun", "flags": 1}]', '[{"name": "Legal", "value": 45, "color": "#DC2626"}, {"name": "Privacy", "value": 30, "color": "#E4902E"}, {"name": "Compliance", "value": 25, "color": "#5929d0"}]')
ON CONFLICT (id) DO UPDATE SET
    active_cases = EXCLUDED.active_cases,
    pending_approvals = EXCLUDED.pending_approvals,
    blocked_comms = EXCLUDED.blocked_comms,
    avg_hil_turnaround = EXCLUDED.avg_hil_turnaround,
    weekly_flags = EXCLUDED.weekly_flags,
    case_breakdown = EXCLUDED.case_breakdown;

INSERT INTO customer_portal (id, product_areas, issue_types, tickets, linked_kb) 
VALUES (1, '["Payments", "Authentication", "Reporting", "Integrations"]', '["Bug", "Enhancement Request", "Access Issue", "Performance Issue", "Billing/Account"]', '[{"id": "CUST-2201", "summary": "Export report missing filters", "status": "In Progress", "sla_target": "4h response, 24h resolution"}, {"id": "CUST-2202", "summary": "Unable to reset MFA after device change", "status": "Pending Customer", "sla_target": "1h response, 8h resolution"}, {"id": "CUST-2203", "summary": "Webhook retries delayed", "status": "In Triage", "sla_target": "15m response, 4h resolution"}]', '[{"title": "How to configure report filters in exports", "tag": "Reporting"}, {"title": "MFA recovery and identity verification workflow", "tag": "Authentication"}, {"title": "Webhook retry diagnostics checklist", "tag": "Integrations"}]')
ON CONFLICT (id) DO UPDATE SET
    product_areas = EXCLUDED.product_areas,
    issue_types = EXCLUDED.issue_types,
    tickets = EXCLUDED.tickets,
    linked_kb = EXCLUDED.linked_kb;

-- ─── 7. Activity Logs ────────────────────────────────────────────────────────
INSERT INTO activity_logs (id, time, severity, source, message, role_scope) VALUES 
('LOG-1042', '09:42', 'success', 'SLA Monitor', 'P1 first-response window recovered for Acme Corp.', 'Support'),
('LOG-1041', '09:36', 'warning', 'HIL Queue', 'VIP checkpoint waiting 45m for manager approval.', 'Manager'),
('LOG-1040', '09:28', 'info', 'Ticket Intake', '12 new omnichannel tickets normalized and triaged.', 'Support'),
('LOG-1039', '09:17', 'error', 'Integration', 'Zendesk webhook retry failed on channel sync batch.', 'Admin'),
('LOG-1038', '09:04', 'info', 'VoC Engine', 'Recurring reporting export theme linked to 8 tickets.', 'Executive'),
('LOG-1037', '08:52', 'warning', 'Compliance', 'Legal phrase detected in draft customer response.', 'Legal'),
('LOG-1036', '08:41', 'success', 'Knowledge Base', 'SSO recovery article moved to publication review.', 'Support')
ON CONFLICT (id) DO UPDATE SET
    time = EXCLUDED.time,
    severity = EXCLUDED.severity,
    source = EXCLUDED.source,
    message = EXCLUDED.message,
    role_scope = EXCLUDED.role_scope;

-- ─── 9. SLA Configurations ───────────────────────────────────────────────────
INSERT INTO cs_sla_configs (sla_config_id, customer_tier, priority, first_response_minutes, resolution_hours, warning_threshold_pct, critical_threshold_pct, is_active) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'enterprise', 'P1',  15,    4,   75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'enterprise', 'P2',  60,    8,   75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'enterprise', 'P3',  240,   24,  75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'enterprise', 'P4',  480,   72,  75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'business',   'P1',  15,    8,   75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'business',   'P2',  60,    24,  75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'business',   'P3',  240,   48,  75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'business',   'P4',  480,   120, 75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'standard',   'P1',  15,    24,  75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'standard',   'P2',  60,    48,  75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'standard',   'P3',  240,   96,  75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14', 'standard',   'P4',  480,   168, 75, 90, true)
ON CONFLICT (customer_tier, priority) DO UPDATE SET
    first_response_minutes = EXCLUDED.first_response_minutes,
    resolution_hours = EXCLUDED.resolution_hours,
    warning_threshold_pct = EXCLUDED.warning_threshold_pct,
    critical_threshold_pct = EXCLUDED.critical_threshold_pct;

-- ─── 10. New CS Users ─────────────────────────────────────────────────────────
INSERT INTO cs_users (user_id, name, email, role) VALUES 
('9c4cae89-004d-45fe-b6ba-2ab767ed418c', 'Admin Agent', 'admin@csagent.io', 'admin')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;

-- ─── 9. New CS Customers ─────────────────────────────────────────────────────
INSERT INTO cs_customers (customer_id, name, email, account_tier) VALUES 
('2219823b-e458-44be-bffb-30a2db5b1d02', 'Acme Corp', 'contact@acmecorp.com', 'enterprise'),
('d4eb5f03-93b2-4b61-b6c4-489155634d24', 'Globex', 'contact@globex.com', 'business'),
('3399b4e0-4550-4fc9-9790-5b91a3081b42', 'Initech', 'contact@initech.com', 'standard'),
('8936c523-6524-459b-9e15-f86ec28b30fb', 'Soylent', 'contact@soylent.com', 'enterprise'),
('0c53d8e7-4733-4a1c-bd8c-1925aea38400', 'Hooli', 'contact@hooli.com', 'enterprise'),
('bf97340c-d923-4d11-9249-abbf87ded271', 'Vehement Capital', 'contact@vehementcapital.com', 'business'),
('68988bde-1159-4b8b-aa43-8817caf48416', 'Massive Dynamic', 'contact@massivedynamic.com', 'enterprise'),
('1ee4dbc3-0350-4562-b45f-7c8bf9fc8589', 'Umbrella', 'contact@umbrella.com', 'standard'),
('24cd79f8-0811-4de1-90f7-cc541549ffaf', 'Wonka Industries', 'contact@wonkaindustries.com', 'business'),
('debf58dd-0488-4ac5-81a9-91982846121f', 'Stark Industries', 'contact@starkindustries.com', 'enterprise'),
('2e12fbf5-667d-4287-be1a-241539890f9b', 'Wayne Enterprises', 'contact@wayneenterprises.com', 'enterprise'),
('7b446757-3625-45c3-a394-350c356661b8', 'Tyrell Corp', 'contact@tyrellcorp.com', 'business'),
('67e8c400-57a3-439b-ac32-e0c08727dbf9', 'Oceanic', 'contact@oceanic.com', 'standard'),
('0f50d9a7-673c-4003-823e-6ad14931dbf9', 'Cyberdyne', 'contact@cyberdyne.com', 'enterprise'),
('d86a3da2-9eb9-4b96-80cb-0ebdda5bb8b5', 'Nakatomi', 'contact@nakatomi.com', 'business'),
('9a06c95e-eab8-43de-9e6c-7cc250b78288', 'Pied Piper', 'contact@piedpiper.com', 'standard'),
('adefc8b6-4437-45ac-be93-308bdc29d835', 'Aperture', 'contact@aperture.com', 'enterprise'),
('6d0e82aa-8fb0-4556-8743-5753b177da32', 'Monarch', 'contact@monarch.com', 'business'),
('0643ddc9-c71e-40fa-bfa6-4a91bcc44858', 'Gekko & Co', 'contact@gekko&co.com', 'enterprise'),
('fd04dedb-8619-4acb-8d7b-18e3e5e6e96f', 'Initrode', 'contact@initrode.com', 'standard'),
('aca12740-5101-4c2c-a2f4-ba02e119addf', 'Oscorp', 'contact@oscorp.com', 'business')
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    account_tier = EXCLUDED.account_tier;

-- ─── 10. New CS Incidents ────────────────────────────────────────────────────
INSERT INTO cs_incidents (incident_id, external_incident_id, title, description, status, severity, source_system) VALUES 
('b2d5b36f-add8-4689-9352-826fd386c545', 'INC-1001', 'EU Cluster Timeout', 'Major network latency in EU-Central-1', 'resolved', 'major', 'sre_agent')
ON CONFLICT (external_incident_id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    severity = EXCLUDED.severity;

-- ─── 11. New CS KB Articles ──────────────────────────────────────────────────
INSERT INTO cs_kb_articles (article_id, title, content, product_area, ticket_type, status) VALUES 
('29e3a207-d1ba-4e21-9916-cbab2b231dcc', 'Configuring SAML for Azure AD', 'Full content for Configuring SAML for Azure AD', 'Authentication', 'access', 'published'),
('7da26c22-960a-48e3-836d-564d2b5bd3a1', 'Optimizing Batch Processors', 'Full content for Optimizing Batch Processors', 'Infrastructure', 'performance', 'published')
ON CONFLICT (article_id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    product_area = EXCLUDED.product_area,
    status = EXCLUDED.status;

-- ─── 12. New CS Tickets ──────────────────────────────────────────────────────
INSERT INTO cs_tickets (ticket_id, customer_id, title, description, ticket_type, priority, status, source_channel, account_tier, sentiment_label, hil_required, hil_trigger_reason, linked_incident_id) VALUES 
('40521f5d-b435-4e31-af05-b8dd32ef2342', '2219823b-e458-44be-bffb-30a2db5b1d02', 'Payment Gateway Timeout in EU cluster', 'Auto-generated mock description', 'bug', 'P1', 'in_progress', 'portal', 'enterprise', 'angry', false, NULL, 'b2d5b36f-add8-4689-9352-826fd386c545'),
('da35ad33-1e54-4e81-896a-57bbba87a9b1', 'd4eb5f03-93b2-4b61-b6c4-489155634d24', 'How to export CSV with historical data', 'Auto-generated mock description', 'bug', 'P3', 'routed', 'portal', 'business', 'neutral', false, NULL, NULL),
('828ff120-d2c2-4f56-9a8f-2b3adfa670d4', '3399b4e0-4550-4fc9-9790-5b91a3081b42', 'Login API returns HTTP 500 on MFA fallback', 'Auto-generated mock description', 'bug', 'P2', 'acknowledged', 'portal', 'standard', 'negative', false, NULL, NULL),
('f2561063-e0fd-4661-92c2-61f1c587eaca', '8936c523-6524-459b-9e15-f86ec28b30fb', 'GDPR data deletion and audit evidence request', 'Auto-generated mock description', 'bug', 'P1', 'new', 'portal', 'enterprise', 'neutral', true, 'legal', NULL)
ON CONFLICT (ticket_id) DO UPDATE SET status = EXCLUDED.status;

-- ─── 13. CS Communication Logs ───────────────────────────────────────────────
INSERT INTO cs_communication_logs (comm_id, ticket_id, channel, direction, content, sender_type) VALUES 
('bad1127f-7f73-4583-aeba-c9859a3c2b96', '40521f5d-b435-4e31-af05-b8dd32ef2342', 'portal', 'outbound', 'Thank you for your report. We are looking into it.', 'agent_ai')
ON CONFLICT (comm_id) DO NOTHING;

-- ─── 14. CS HIL Reviews ──────────────────────────────────────────────────────
INSERT INTO cs_hil_reviews (hil_id, ticket_id, checkpoint_type, trigger_reason, status) VALUES 
('c1b758e1-537e-4499-af94-1177d55d38e1', 'f2561063-e0fd-4661-92c2-61f1c587eaca', 'HIL-1', 'legal', 'pending')
ON CONFLICT (hil_id) DO UPDATE SET status = EXCLUDED.status;

-- ─── 15. CSAT & Alerts ───────────────────────────────────────────────────────
INSERT INTO cs_csat_surveys (csat_id, ticket_id, customer_id, rating, feedback_text) VALUES 
('1d13b326-5f26-4c2b-a4f4-3f1c4bbbe2d0', '40521f5d-b435-4e31-af05-b8dd32ef2342', '2219823b-e458-44be-bffb-30a2db5b1d02', 5, 'Great support!')
ON CONFLICT (csat_id) DO NOTHING;

INSERT INTO cs_sla_alerts (alert_id, ticket_id, alert_type, sla_type, threshold_pct) VALUES 
('b4c037ec-7c5c-4545-837e-7915a0168fb8', '40521f5d-b435-4e31-af05-b8dd32ef2342', 'warning', 'first_response', 75)
ON CONFLICT (alert_id) DO NOTHING;