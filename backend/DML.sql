-- =============================================================================
-- X2 Dashboard – PostgreSQL DML (Data Manipulation Language)
-- Robust seeding script with idempotency (ON CONFLICT)
-- Updated for standardized Review terminology and new production tables
-- =============================================================================

-- ─── 1. Roles ───────────────────────────────────────────────────────────────
INSERT INTO roles (id, name) VALUES 
('SUPPORT_LEAD', 'Support Lead'),
('SUPPORT_MANAGER', 'Support Manager'),
('VP_CUSTOMER_SUCCESS', 'VP Customer Success'),
('LEGAL_COMPLIANCE', 'Legal / Compliance'),
('ADMIN_OPS', 'Admin / Ops'),
('CUSTOMER', 'Customer')
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
('LGL-104', 'Soylent', 'Enterprise', 'GDPR data deletion and audit evidence request', '2d', 'Review Legal', 'P1', 'Neutral'),
('TCK-9904', 'Hooli', 'Enterprise', 'Production latency spikes after rollout', '22m', 'In Progress', 'P1', 'Angry'),
('TCK-9905', 'Vehement Capital', 'Business', 'Unable to add new SSO metadata certificate', '2h 05m', 'In Triage', 'P2', 'Frustrated'),
('TCK-9906', 'Massive Dynamic', 'Enterprise', 'Invoice PDF contains wrong tax code', '6h', 'Routed', 'P2', 'Neutral'),
('TCK-9907', 'Umbrella', 'Standard', 'Webhook retries do not trigger after timeout', '16h', 'Ack', 'P3', 'Neutral')
ON CONFLICT (id) DO UPDATE SET 
    customer = EXCLUDED.customer,
    tier = EXCLUDED.tier,
    summary = EXCLUDED.summary,
    time_remaining = EXCLUDED.time_remaining,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    sentiment = EXCLUDED.sentiment;

-- ─── 5. Review Queue (Legacy) ───────────────────────────────────────────────────
INSERT INTO review_queue (id, ticket_id, checkpoint_type, age, customer_tier) VALUES 
('REV-301', 'TCK-9901', 'VIP Interaction', '45m', 'Enterprise'),
('REV-302', 'TCK-9908', 'Billing Dispute', '2h', 'Business'),
('REV-303', 'LGL-104', 'Legal Correspondence', '1d', 'Enterprise')
ON CONFLICT (id) DO UPDATE SET
    ticket_id = EXCLUDED.ticket_id,
    checkpoint_type = EXCLUDED.checkpoint_type,
    age = EXCLUDED.age,
    customer_tier = EXCLUDED.customer_tier;

-- ─── 6. Singleton / Dashboard Feature Tables ─────────────────────────────────
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
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

INSERT INTO legal_overview (id, active_cases, pending_approvals, blocked_comms, avg_review_turnaround, weekly_flags, case_breakdown) 
VALUES (1, 11, 6, 3, '3h 20m', '[{"day": "Mon", "flags": 2}, {"day": "Tue", "flags": 1}]', '[{"name": "Legal", "value": 45, "color": "#DC2626"}]')
ON CONFLICT (id) DO UPDATE SET active_cases = EXCLUDED.active_cases;

-- ─── 9. SLA Configurations ───────────────────────────────────────────────────
INSERT INTO cs_sla_configs (sla_config_id, customer_tier, priority, first_response_minutes, resolution_hours, warning_threshold_pct, critical_threshold_pct, is_active) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'enterprise', 'P1',  15,    4,   75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'enterprise', 'P2',  60,    8,   75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'business',   'P1',  15,    8,   75, 90, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'standard',   'P1',  15,    24,  75, 90, true)
ON CONFLICT (customer_tier, priority) DO NOTHING;

-- ─── 10. CS Users ────────────────────────────────────────────────────────────
INSERT INTO cs_users (user_id, name, email, role) VALUES 
('9c4cae89-004d-45fe-b6ba-2ab767ed418c', 'Luka Admin', 'admin@csagent.io', 'admin'),
('b1a2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6', 'Sarah Lead', 'sarah@csagent.io', 'support_lead'),
('c1d2e3f4-a5b6-47c8-9d0e-1f2a3b4c5d6e', 'Mark Manager', 'mark@csagent.io', 'support_manager')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

-- ─── 11. CS Customers ────────────────────────────────────────────────────────
INSERT INTO cs_customers (customer_id, name, email, account_tier, is_vip, risk_score) VALUES 
('2219823b-e458-44be-bffb-30a2db5b1d02', 'Acme Corp', 'contact@acmecorp.com', 'enterprise', true, 12.5),
('d4eb5f03-93b2-4b61-b6c4-489155634d24', 'Globex', 'contact@globex.com', 'business', false, 45.0),
('3399b4e0-4550-4fc9-9790-5b91a3081b42', 'Initech', 'contact@initech.com', 'standard', false, 5.0)
ON CONFLICT (email) DO UPDATE SET risk_score = EXCLUDED.risk_score;

-- ─── 12. CS Incidents ────────────────────────────────────────────────────────
INSERT INTO cs_incidents (incident_id, external_incident_id, title, description, status, severity, source_system) VALUES 
('b2d5b36f-add8-4689-9352-826fd386c545', 'INC-1001', 'EU Cluster Timeout', 'Major network latency in EU-Central-1', 'resolved', 'major', 'sre_agent')
ON CONFLICT (external_incident_id) DO NOTHING;

-- ─── 13. CS KB Articles ──────────────────────────────────────────────────────
INSERT INTO cs_kb_articles (article_id, title, content, product_area, ticket_type, status, usage_count) VALUES 
('29e3a207-d1ba-4e21-9916-cbab2b231dcc', 'Configuring SAML for Azure AD', 'Steps to sync users via SCIM and SAML...', 'Authentication', 'access', 'published', 142),
('7da26c22-960a-48e3-836d-564d2b5bd3a1', 'Optimizing Batch Processors', 'Best practices for high-volume data ingestion...', 'Infrastructure', 'performance', 'published', 89)
ON CONFLICT (article_id) DO NOTHING;

-- ─── 14. CS Tickets ──────────────────────────────────────────────────────────
INSERT INTO cs_tickets (
    ticket_id, customer_id, title, description, ticket_type, priority, status, 
    source_channel, account_tier, sentiment_label, sentiment_score,
    review_required, review_trigger_reason, linked_incident_id,
    sla_first_response_due, sla_resolution_due
) VALUES 
('40521f5d-b435-4e31-af05-b8dd32ef2342', '2219823b-e458-44be-bffb-30a2db5b1d02', 'Payment Gateway Timeout in EU cluster', 'Multiple customers reporting 504 timeouts on checkout.', 'bug', 'P1', 'in_progress', 'portal', 'enterprise', 'angry', 0.1, false, NULL, 'b2d5b36f-add8-4689-9352-826fd386c545', NOW() + INTERVAL '15 minutes', NOW() + INTERVAL '4 hours'),
('da35ad33-1e54-4e81-896a-57bbba87a9b1', 'd4eb5f03-93b2-4b61-b6c4-489155634d24', 'How to export CSV with historical data', 'I need a report of all transactions from 2023.', 'training', 'P3', 'routed', 'portal', 'business', 'neutral', 0.5, false, NULL, NULL, NOW() + INTERVAL '4 hours', NOW() + INTERVAL '24 hours'),
('f2561063-e0fd-4661-92c2-61f1c587eaca', '2219823b-e458-44be-bffb-30a2db5b1d02', 'GDPR data deletion and audit evidence request', 'Legal request for data erasure for user 9921.', 'legal', 'P1', 'new', 'portal', 'enterprise', 'neutral', 0.5, true, 'legal', NULL, NOW() + INTERVAL '15 minutes', NOW() + INTERVAL '4 hours'),
('828ff120-d2c2-4f56-9a8f-2b3adfa670d4', '3399b4e0-4550-4fc9-9790-5b91a3081b42', 'Login API returns HTTP 500 on MFA fallback', 'Seeing sporadic 500 errors during SMS challenge.', 'bug', 'P2', 'acknowledged', 'portal', 'standard', 'negative', 0.3, false, NULL, NULL, NOW() + INTERVAL '1 hour', NOW() + INTERVAL '48 hours')
ON CONFLICT (ticket_id) DO NOTHING;

-- ─── 15. CS Reviews ──────────────────────────────────────────────────────────
INSERT INTO cs_reviews (review_id, ticket_id, checkpoint_type, trigger_reason, status) VALUES 
('c1b758e1-537e-4499-af94-1177d55d38e1', 'f2561063-e0fd-4661-92c2-61f1c587eaca', 'Review-1', 'legal', 'pending'),
('d2c869f2-648f-45aa-bf05-2288e66e49f2', '40521f5d-b435-4e31-af05-b8dd32ef2342', 'Review-4', 'critical_escalation', 'pending')
ON CONFLICT (review_id) DO NOTHING;

-- ─── 16. CS Notes ────────────────────────────────────────────────────────────
INSERT INTO cs_notes (note_id, content) VALUES 
('e1f2a3b4-c5d6-47e8-9f0a-1b2c3d4e5f6a', 'Investigating EU cluster latency - looks like a bad deployment in EU-West-1.'),
('f2a3b4c5-d6e7-48f9-a0b1-2c3d4e5f6a7b', 'Customer is requesting a refund due to the downtime. Escalating to billing.')
ON CONFLICT (note_id) DO NOTHING;

-- ─── 17. Channel Configs ─────────────────────────────────────────────────────
INSERT INTO cs_channel_configs (channel, is_active, config) VALUES 
('email', true, '{"provider": "sendgrid", "retry_policy": "exponential"}'),
('chat', true, '{"welcome_message": "Hello! How can we help you today?", "ai_enabled": true}'),
('portal', true, '{"pii_redaction": true, "attachment_limit_mb": 25}')
ON CONFLICT (channel) DO UPDATE SET is_active = EXCLUDED.is_active;

-- ─── 18. Communication Templates ─────────────────────────────────────────────
INSERT INTO cs_communication_templates (name, ticket_type, subject, body, variables) VALUES 
('Incident Acknowledgment', 'bug', 'Re: {{ticket_id}} - We are investigating', 'Hello {{customer_name}}, we have received your report regarding {{title}} and are investigating.', '["ticket_id", "customer_name", "title"]'),
('Legal Response Received', 'legal', 'Confirmation: Data Deletion Request', 'Thank you for your request. Our legal team is reviewing the documentation.', '["customer_name"]')
ON CONFLICT (name) DO NOTHING;

-- ─── 19. Audit Logs ──────────────────────────────────────────────────────────
INSERT INTO cs_audit_logs (entity_type, entity_id, action, actor_type, actor_id) VALUES 
('ticket', '40521f5d-b435-4e31-af05-b8dd32ef2342', 'update_status', 'human', 'sarah@csagent.io'),
('review', 'c1b758e1-537e-4499-af94-1177d55d38e1', 'assign_reviewer', 'system', 'luka_ai');

-- ─── 20. Reports ─────────────────────────────────────────────────────────────
INSERT INTO cs_reports (report_type, period_start, period_end, data) VALUES 
('weekly_sla', NOW() - INTERVAL '7 days', NOW(), '{"compliance_rate": 94.5, "total_breaches": 2, "avg_resolution_hrs": 4.2}')
ON CONFLICT (report_id) DO NOTHING;