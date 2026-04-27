-- =============================================================================
-- X2 Dashboard – PostgreSQL DDL (reset schema)
-- Legacy RBAC/mock tables + CSAgent production schema (BRD-021)

-- Reset the public schema to ensure a clean slate before recreating tables
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
SET search_path TO public;
-- =============================================================================

-- Legacy RBAC / mock tables ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS roles (
    id      VARCHAR(50)  PRIMARY KEY,
    name    VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
    id          SERIAL       PRIMARY KEY,
    role_id     VARCHAR(50)  NOT NULL,
    permission  VARCHAR(100) NOT NULL,
    CONSTRAINT uq_role_permission UNIQUE (role_id, permission)
);

CREATE TABLE IF NOT EXISTS metrics (
    role_id  VARCHAR(50) PRIMARY KEY,
    data     JSONB       NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
    id              VARCHAR(20)  PRIMARY KEY,
    customer        VARCHAR(100),
    tier            VARCHAR(20),
    summary         TEXT,
    time_remaining  VARCHAR(20),
    status          VARCHAR(30),
    priority        VARCHAR(5),
    sentiment       VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS ticket_updates (
    id           SERIAL       PRIMARY KEY,
    ticket_id    VARCHAR(20)  NOT NULL,
    author       VARCHAR(100) NOT NULL,
    author_type  VARCHAR(20)  NOT NULL,
    message      TEXT         NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticket_updates_ticket_id ON ticket_updates(ticket_id);

CREATE TABLE IF NOT EXISTS hil_queue (
    id               VARCHAR(20) PRIMARY KEY,
    ticket_id        VARCHAR(20),
    checkpoint_type  VARCHAR(50),
    age              VARCHAR(20),
    customer_tier    VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS kb_stats (
    id              SERIAL       PRIMARY KEY,
    usage_rate      VARCHAR(10),
    success_rate    VARCHAR(10),
    drafts_pending  INTEGER,
    top_gap         VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS voc (
    id               SERIAL      PRIMARY KEY,
    csat_trend       VARCHAR(10),
    at_risk_count    INTEGER,
    feature_requests JSONB
);

CREATE TABLE IF NOT EXISTS channel_volume (
    id         SERIAL      PRIMARY KEY,
    email      INTEGER,
    chat       INTEGER,
    slack      INTEGER,
    portal     INTEGER,
    whatsapp   INTEGER,
    peak_hour  VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS legal_overview (
    id                  SERIAL      PRIMARY KEY,
    active_cases        INTEGER,
    pending_approvals   INTEGER,
    blocked_comms       INTEGER,
    avg_hil_turnaround  VARCHAR(20),
    weekly_flags        JSONB,
    case_breakdown      JSONB
);

CREATE TABLE IF NOT EXISTS customer_portal (
    id            SERIAL PRIMARY KEY,
    product_areas JSONB,
    issue_types   JSONB,
    tickets       JSONB,
    linked_kb     JSONB
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id          VARCHAR(20) PRIMARY KEY,
    time        VARCHAR(10),
    severity    VARCHAR(20),
    source      VARCHAR(50),
    message     TEXT,
    role_scope  VARCHAR(20)
);

-- =============================================================================
-- CSAgent production schema  (BRD-021)
-- All tables prefixed with "cs_" to avoid collision with legacy tables.
-- =============================================================================

-- ─── 1. Users (internal staff) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_users (
    user_id     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    role        VARCHAR(50)  NOT NULL,   -- support_agent | support_lead | support_manager | csm | vp_customer_success | legal | admin
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── 2. Customers (external) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_customers (
    customer_id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name                        VARCHAR(255) NOT NULL,
    email                       VARCHAR(255) UNIQUE NOT NULL,
    phone                       VARCHAR(50),
    organization                VARCHAR(255),
    account_tier                VARCHAR(20)  NOT NULL DEFAULT 'standard',  -- enterprise | business | standard
    is_vip                      BOOLEAN      NOT NULL DEFAULT FALSE,
    risk_score                  FLOAT        NOT NULL DEFAULT 0.0,
    at_risk_flag                BOOLEAN      NOT NULL DEFAULT FALSE,
    consecutive_negative_csat   INTEGER      NOT NULL DEFAULT 0,
    ticket_frequency_30d        INTEGER      NOT NULL DEFAULT 0,
    ai_disclosure_acknowledged  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── 3. SLA Configurations ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_sla_configs (
    sla_config_id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_tier           VARCHAR(20)  NOT NULL,
    priority                VARCHAR(5)   NOT NULL,
    first_response_minutes  INTEGER      NOT NULL,
    resolution_hours        INTEGER      NOT NULL,
    warning_threshold_pct   INTEGER      NOT NULL DEFAULT 75,
    critical_threshold_pct  INTEGER      NOT NULL DEFAULT 90,
    is_active               BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sla_tier_priority UNIQUE (customer_tier, priority)
);


-- ─── 4. Incidents (synced from SRE Agent / ITSM) ─────────────────────────────
CREATE TABLE IF NOT EXISTS cs_incidents (
    incident_id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    external_incident_id    VARCHAR(255) UNIQUE,
    title                   VARCHAR(500) NOT NULL,
    description             TEXT,
    status                  VARCHAR(50),
    affected_product_area   VARCHAR(255),
    severity                VARCHAR(50),
    source_system           VARCHAR(100),  -- sre_agent | jira | servicenow | manual
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── 5. KB Articles (defined before cs_tickets for FK reference) ──────────────
CREATE TABLE IF NOT EXISTS cs_kb_articles (
    article_id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title                       VARCHAR(500) NOT NULL,
    content                     TEXT         NOT NULL,
    product_area                VARCHAR(255),
    ticket_type                 VARCHAR(50),
    status                      VARCHAR(20)  NOT NULL DEFAULT 'draft',  -- draft | pending_review | published | archived
    usage_count                 INTEGER      NOT NULL DEFAULT 0,
    resolution_success_count    INTEGER      NOT NULL DEFAULT 0,
    resolution_failure_count    INTEGER      NOT NULL DEFAULT 0,
    created_by                  UUID REFERENCES cs_users(user_id),
    reviewed_by                 UUID REFERENCES cs_users(user_id),
    published_at                TIMESTAMPTZ,
    archived_at                 TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── 6. Tickets ──────────────────────────────────────────────────────────────
/*
  Status state machine:
  new → acknowledged → in_triage → routed → in_progress
      → pending_customer → resolution_proposed → resolved
      → customer_confirmed → closed

  Rule: P1/P2 tickets cannot close without customer_confirmed or HIL-3 override.
*/
CREATE TABLE IF NOT EXISTS cs_tickets (
    ticket_id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    external_ticket_id          VARCHAR(255),
    customer_id                 UUID         NOT NULL REFERENCES cs_customers(customer_id),

    ticket_type                 VARCHAR(50),   -- bug|enhancement|training|access|data|performance|infrastructure|billing|legal
    priority                    VARCHAR(5),    -- P1|P2|P3|P4
    status                      VARCHAR(30)    NOT NULL DEFAULT 'new',
    source_channel              VARCHAR(20)    NOT NULL,  -- email|chat|portal|teams|slack|whatsapp|phone|api

    title                       VARCHAR(500)   NOT NULL,
    description                 TEXT           NOT NULL,
    affected_product_area       VARCHAR(255),
    environment                 VARCHAR(100),
    error_messages              TEXT,
    business_impact             TEXT,
    attachments                 JSONB          NOT NULL DEFAULT '[]',
    tags                        JSONB          NOT NULL DEFAULT '[]',

    sentiment_score             FLOAT,
    sentiment_label             VARCHAR(20),   -- positive|neutral|negative|angry
    triage_confidence           FLOAT,
    triage_rationale            TEXT,

    account_tier                VARCHAR(20)    NOT NULL,  -- denormalised from customer at creation
    sla_first_response_due      TIMESTAMPTZ,
    sla_resolution_due          TIMESTAMPTZ,
    first_responded_at          TIMESTAMPTZ,
    resolved_at                 TIMESTAMPTZ,
    closed_at                   TIMESTAMPTZ,
    sla_first_response_breached BOOLEAN        NOT NULL DEFAULT FALSE,
    sla_resolution_breached     BOOLEAN        NOT NULL DEFAULT FALSE,

    assigned_to                 UUID REFERENCES cs_users(user_id),
    assigned_agent_type         VARCHAR(50),

    is_duplicate                BOOLEAN        NOT NULL DEFAULT FALSE,
    master_ticket_id            UUID REFERENCES cs_tickets(ticket_id),
    linked_incident_id          UUID REFERENCES cs_incidents(incident_id),

    hil_required                BOOLEAN        NOT NULL DEFAULT FALSE,
    hil_trigger_reason          VARCHAR(50),

    pii_detected                BOOLEAN        NOT NULL DEFAULT FALSE,
    pii_redacted                BOOLEAN        NOT NULL DEFAULT FALSE,
    ai_disclosure_acknowledged  BOOLEAN        NOT NULL DEFAULT FALSE,

    kb_article_id               UUID REFERENCES cs_kb_articles(article_id),
    kb_resolution_proposed      BOOLEAN        NOT NULL DEFAULT FALSE,

    created_at                  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_cs_tickets_customer_id  ON cs_tickets(customer_id);
CREATE INDEX IF NOT EXISTS ix_cs_tickets_status       ON cs_tickets(status);
CREATE INDEX IF NOT EXISTS ix_cs_tickets_priority     ON cs_tickets(priority);
CREATE INDEX IF NOT EXISTS ix_cs_tickets_created_at   ON cs_tickets(created_at);
CREATE INDEX IF NOT EXISTS ix_cs_tickets_account_tier ON cs_tickets(account_tier);
CREATE INDEX IF NOT EXISTS ix_cs_tickets_sla_due      ON cs_tickets(sla_resolution_due)
    WHERE status NOT IN ('closed','customer_confirmed');

-- ─── 7. KB Article ↔ Ticket (source mapping) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_kb_article_tickets (
    article_id  UUID NOT NULL REFERENCES cs_kb_articles(article_id) ON DELETE CASCADE,
    ticket_id   UUID NOT NULL REFERENCES cs_tickets(ticket_id)      ON DELETE CASCADE,
    PRIMARY KEY (article_id, ticket_id)
);

-- ─── 8. HIL Reviews ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_hil_reviews (
    hil_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id       UUID        NOT NULL REFERENCES cs_tickets(ticket_id),
    checkpoint_type VARCHAR(10) NOT NULL,  -- HIL-1|HIL-3|HIL-4|HIL-5
    trigger_reason  VARCHAR(50) NOT NULL,  -- billing|legal|vip|angry_sentiment|sla_breach|kb_publication|config_review|critical_escalation
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending|approved|rejected|taken_ownership|modified
    reviewer_id     UUID REFERENCES cs_users(user_id),
    reviewed_at     TIMESTAMPTZ,
    comments        TEXT,
    action_taken    VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_cs_hil_reviews_ticket_id ON cs_hil_reviews(ticket_id);
CREATE INDEX IF NOT EXISTS ix_cs_hil_reviews_status    ON cs_hil_reviews(status);

-- ─── 9. Communication Logs ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_communication_logs (
    comm_id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id           UUID        NOT NULL REFERENCES cs_tickets(ticket_id),
    channel             VARCHAR(20) NOT NULL,
    direction           VARCHAR(10) NOT NULL,  -- inbound|outbound
    content             TEXT        NOT NULL,
    content_type        VARCHAR(20) NOT NULL DEFAULT 'text',  -- text|html|template
    template_id         VARCHAR(100),
    sender_type         VARCHAR(20) NOT NULL,  -- customer|agent_ai|human
    sender_id           UUID REFERENCES cs_users(user_id),
    delivery_confirmed  BOOLEAN     NOT NULL DEFAULT FALSE,
    delivery_timestamp  TIMESTAMPTZ,
    pii_redacted        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_cs_comm_logs_ticket_id  ON cs_communication_logs(ticket_id);
CREATE INDEX IF NOT EXISTS ix_cs_comm_logs_created_at ON cs_communication_logs(created_at);

-- ─── 10. CSAT Surveys ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_csat_surveys (
    csat_id       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id     UUID        UNIQUE NOT NULL REFERENCES cs_tickets(ticket_id),
    customer_id   UUID        NOT NULL REFERENCES cs_customers(customer_id),
    rating        SMALLINT    CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    sent_at       TIMESTAMPTZ,
    responded_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_cs_csat_customer_id ON cs_csat_surveys(customer_id);

-- ─── 11. SLA Alerts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_sla_alerts (
    alert_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id       UUID        NOT NULL REFERENCES cs_tickets(ticket_id),
    alert_type      VARCHAR(20) NOT NULL,  -- warning|critical|breach
    sla_type        VARCHAR(20) NOT NULL,  -- first_response|resolution
    threshold_pct   INTEGER,
    triggered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES cs_users(user_id)
);

CREATE INDEX IF NOT EXISTS ix_cs_sla_alerts_ticket_id ON cs_sla_alerts(ticket_id);

-- ─── 12. Audit Logs (append-only) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_audit_logs (
    audit_id    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id   VARCHAR(36)  NOT NULL,
    action      VARCHAR(100) NOT NULL,
    actor_id    VARCHAR(255),
    actor_type  VARCHAR(20)  NOT NULL,  -- human|system
    old_value   JSONB,
    new_value   JSONB,
    ip_address  VARCHAR(50),
    timestamp   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_cs_audit_entity    ON cs_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS ix_cs_audit_timestamp ON cs_audit_logs(timestamp);

-- ─── 13. Reports ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_reports (
    report_id     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type   VARCHAR(50) NOT NULL,  -- daily_digest|weekly_sla|weekly_csat|ticket_ageing|monthly_voc
    period_start  TIMESTAMPTZ NOT NULL,
    period_end    TIMESTAMPTZ NOT NULL,
    data          JSONB       NOT NULL,
    generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    generated_by  VARCHAR(20) NOT NULL DEFAULT 'system'
);

-- ─── 14. Channel Configurations ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_channel_configs (
    channel_config_id   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    channel             VARCHAR(20) UNIQUE NOT NULL,
    is_active           BOOLEAN     NOT NULL DEFAULT FALSE,
    config              JSONB       NOT NULL DEFAULT '{}',
    validated_by        UUID REFERENCES cs_users(user_id),
    validated_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 15. Communication Templates ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cs_communication_templates (
    template_id   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    ticket_type   VARCHAR(50),
    customer_tier VARCHAR(20),
    channel       VARCHAR(20),
    subject       VARCHAR(500),
    body          TEXT         NOT NULL,
    variables     JSONB        NOT NULL DEFAULT '[]',
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    approved_by   UUID REFERENCES cs_users(user_id),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
