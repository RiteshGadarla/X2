import uuid
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import (
    Role, RolePermission, Metric, Ticket, HILQueue,
    KBStats, VOC, ChannelVolume, LegalOverview, CustomerPortal, ActivityLog,
    CSUser, CSCustomer, CSSLAConfig, CSTicket, CSHILReview, CSCommunicationLog
)
from mock_data import (
    ROLES, ROLE_PERMISSIONS, MOCK_METRICS, MOCK_TICKETS,
    MOCK_HIL_QUEUE, MOCK_KB_STATS, MOCK_VOC, MOCK_CHANNEL_VOL,
    MOCK_LEGAL_OVERVIEW, MOCK_CUSTOMER_PORTAL, MOCK_ACTIVITY_LOGS,
)

def map_status(mock_status: str) -> str:
    s = mock_status.lower()
    if "in progress" in s: return "in_progress"
    if "routed" in s: return "routed"
    if "ack" in s: return "acknowledged"
    if "triage" in s: return "in_triage"
    if "pending" in s: return "pending_customer"
    if "resolution" in s: return "resolution_proposed"
    return "new"

def map_sentiment(mock_sentiment: str) -> str:
    s = mock_sentiment.lower()
    if "angry" in s: return "angry"
    if "frustrated" in s: return "negative"
    if "neutral" in s: return "neutral"
    return "neutral"

def seed_db():
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Legacy Seeding
        for role in ROLES:
            db.add(Role(id=role["id"], name=role["name"]))
        for role_id, permissions in ROLE_PERMISSIONS.items():
            for perm in permissions:
                db.add(RolePermission(role_id=role_id, permission=perm))
        for role_id, data in MOCK_METRICS.items():
            db.add(Metric(role_id=role_id, data=data))
        for ticket in MOCK_TICKETS:
            db.add(Ticket(**ticket))
        for item in MOCK_HIL_QUEUE:
            db.add(HILQueue(**item))
        db.add(KBStats(**MOCK_KB_STATS))
        db.add(VOC(csat_trend=MOCK_VOC["csat_trend"], at_risk_count=MOCK_VOC["at_risk_count"], feature_requests=MOCK_VOC["feature_requests"]))
        db.add(ChannelVolume(**MOCK_CHANNEL_VOL))
        db.add(LegalOverview(**MOCK_LEGAL_OVERVIEW))
        db.add(CustomerPortal(**MOCK_CUSTOMER_PORTAL))
        for log in MOCK_ACTIVITY_LOGS:
            db.add(ActivityLog(**log))
        db.flush()

        # CSAgent Production Models Seeding
        # Users
        admin_user = CSUser(name="Admin Agent", email="admin@csagent.io", role="admin")
        db.add(admin_user)
        db.flush()

        # Extract unique customers
        customer_map = {}
        for mock_ticket in MOCK_TICKETS:
            c_name = mock_ticket["customer"]
            if c_name not in customer_map:
                tier = mock_ticket["tier"].lower()
                c = CSCustomer(name=c_name, email=f"contact@{c_name.replace(' ', '').lower()}.com", account_tier=tier)
                db.add(c)
                db.flush()
                customer_map[c_name] = c
                
                # Create SLA config for this tier if we haven't already (simple fallback)
                # Actually, standard DDL seed does this, but since we drop all tables, we must recreate SLAs.
                # Just create basic ones per tier
                for priority, resp_min, res_hr in [("P1", 15, 4), ("P2", 60, 8), ("P3", 240, 24), ("P4", 480, 72)]:
                    # Using a try-catch for uniqueness or just query first
                    exists = db.query(CSSLAConfig).filter_by(customer_tier=tier, priority=priority).first()
                    if not exists:
                        db.add(CSSLAConfig(customer_tier=tier, priority=priority, first_response_minutes=resp_min, resolution_hours=res_hr))

        # Tickets & HIL
        seeded_tickets_count = 0
        for mock_ticket in MOCK_TICKETS:
            c = customer_map[mock_ticket["customer"]]
            mapped_status = map_status(mock_ticket["status"])
            
            hil_required = False
            trigger_reason = None
            if "hil legal" in mock_ticket["status"].lower():
                hil_required = True
                trigger_reason = "legal"
                mapped_status = "new" # Ticket blocked at creation

            t = CSTicket(
                customer_id=c.customer_id,
                title=mock_ticket["summary"],
                description="Auto-generated mock description for: " + mock_ticket["summary"],
                ticket_type="bug",
                priority=mock_ticket["priority"],
                status=mapped_status,
                source_channel="portal",
                account_tier=c.account_tier,
                sentiment_label=map_sentiment(mock_ticket["sentiment"]),
                hil_required=hil_required,
                hil_trigger_reason=trigger_reason
            )
            db.add(t)
            db.flush()
            seeded_tickets_count += 1
            
            if hil_required:
                hr = CSHILReview(
                    ticket_id=t.ticket_id,
                    checkpoint_type="HIL-1",
                    trigger_reason=trigger_reason,
                    status="pending"
                )
                db.add(hr)

        db.commit()
        return seeded_tickets_count
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()
