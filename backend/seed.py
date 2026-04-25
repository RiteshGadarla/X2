"""
Run once to create all tables and populate them with mock data.
Usage: python seed.py
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal
from models import (
    Role, RolePermission, Metric, Ticket, HILQueue,
    KBStats, VOC, ChannelVolume, LegalOverview, CustomerPortal, ActivityLog,
)
from mock_data import (
    ROLES, ROLE_PERMISSIONS, MOCK_METRICS, MOCK_TICKETS,
    MOCK_HIL_QUEUE, MOCK_KB_STATS, MOCK_VOC, MOCK_CHANNEL_VOL,
    MOCK_LEGAL_OVERVIEW, MOCK_CUSTOMER_PORTAL, MOCK_ACTIVITY_LOGS,
)


def seed():
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("  Inserting roles...")
        for role in ROLES:
            db.add(Role(id=role["id"], name=role["name"]))

        print("  Inserting role_permissions...")
        for role_id, permissions in ROLE_PERMISSIONS.items():
            for perm in permissions:
                db.add(RolePermission(role_id=role_id, permission=perm))

        print("  Inserting metrics...")
        for role_id, data in MOCK_METRICS.items():
            db.add(Metric(role_id=role_id, data=data))

        print("  Inserting tickets...")
        for ticket in MOCK_TICKETS:
            db.add(Ticket(**ticket))

        print("  Inserting hil_queue...")
        for item in MOCK_HIL_QUEUE:
            db.add(HILQueue(**item))

        print("  Inserting kb_stats...")
        db.add(KBStats(**MOCK_KB_STATS))

        print("  Inserting voc...")
        db.add(VOC(
            csat_trend=MOCK_VOC["csat_trend"],
            at_risk_count=MOCK_VOC["at_risk_count"],
            feature_requests=MOCK_VOC["feature_requests"],
        ))

        print("  Inserting channel_volume...")
        db.add(ChannelVolume(**MOCK_CHANNEL_VOL))

        print("  Inserting legal_overview...")
        db.add(LegalOverview(**MOCK_LEGAL_OVERVIEW))

        print("  Inserting customer_portal...")
        db.add(CustomerPortal(**MOCK_CUSTOMER_PORTAL))

        print("  Inserting activity_logs...")
        for log in MOCK_ACTIVITY_LOGS:
            db.add(ActivityLog(**log))

        db.commit()
        print("\nDone — all mock data seeded to PostgreSQL.")
    except Exception as exc:
        db.rollback()
        print(f"\nSeed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
