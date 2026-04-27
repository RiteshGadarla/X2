"""
Report generation service.
All reports are aggregated from the database and cached in cs_reports.
"""

from datetime import datetime, timedelta, timezone, date as date_type
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
import models


# ─── helpers ─────────────────────────────────────────────────────────────────

def _store(report_type: str, period_start: datetime, period_end: datetime,
           data: dict, db: Session) -> models.CSReport:
    report = models.CSReport(
        report_type=report_type,
        period_start=period_start,
        period_end=period_end,
        data=data,
        generated_by="system",
    )
    db.add(report)
    return report


# ─── R-01  Daily Support Digest ──────────────────────────────────────────────

def generate_daily_digest(db: Session, target_date: date_type | None = None) -> models.CSReport:
    if target_date is None:
        target_date = datetime.now(timezone.utc).date()

    day_start = datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0, tzinfo=timezone.utc)
    day_end = day_start + timedelta(days=1)
    prev_24h_start = day_start - timedelta(hours=24)

    opened = db.query(func.count(models.CSTicket.ticket_id)).filter(
        models.CSTicket.created_at >= day_start,
        models.CSTicket.created_at < day_end,
    ).scalar() or 0

    closed = db.query(func.count(models.CSTicket.ticket_id)).filter(
        models.CSTicket.closed_at >= day_start,
        models.CSTicket.closed_at < day_end,
    ).scalar() or 0

    open_by_priority: dict[str, int] = {}
    for p in ("P1", "P2", "P3", "P4"):
        open_by_priority[p] = db.query(func.count(models.CSTicket.ticket_id)).filter(
            models.CSTicket.priority == p,
            models.CSTicket.status.notin_(["closed", "customer_confirmed"]),
        ).scalar() or 0

    total_24h = db.query(func.count(models.CSTicket.ticket_id)).filter(
        models.CSTicket.created_at >= prev_24h_start,
        models.CSTicket.created_at < day_end,
    ).scalar() or 0

    breached_24h = db.query(func.count(models.CSTicket.ticket_id)).filter(
        models.CSTicket.created_at >= prev_24h_start,
        models.CSTicket.created_at < day_end,
        or_(
            models.CSTicket.sla_first_response_breached.is_(True),
            models.CSTicket.sla_resolution_breached.is_(True),
        ),
    ).scalar() or 0

    sla_rate = round((1 - breached_24h / total_24h) * 100, 1) if total_24h > 0 else 100.0

    overdue = db.query(func.count(models.CSTicket.ticket_id)).filter(
        models.CSTicket.status.notin_(["closed", "customer_confirmed"]),
        models.CSTicket.sla_resolution_due < datetime.now(timezone.utc),
    ).scalar() or 0

    escalations = db.query(func.count(models.CSHILReview.hil_id)).filter(
        models.CSHILReview.created_at >= day_start,
        models.CSHILReview.created_at < day_end,
    ).scalar() or 0

    avg_csat = db.query(func.avg(models.CSCSATSurvey.rating)).filter(
        models.CSCSATSurvey.responded_at >= day_start,
        models.CSCSATSurvey.responded_at < day_end,
    ).scalar()

    data = {
        "date": target_date.isoformat(),
        "tickets_opened": opened,
        "tickets_closed": closed,
        "currently_open_by_priority": open_by_priority,
        "sla_compliance_rate_24h": sla_rate,
        "overdue_tickets": overdue,
        "hil_escalations_today": escalations,
        "avg_csat_today": round(float(avg_csat), 2) if avg_csat else None,
    }
    return _store("daily_digest", day_start, day_end, data, db)


# ─── R-02  Weekly SLA Compliance Report ──────────────────────────────────────

def generate_weekly_sla(db: Session, week_start: datetime | None = None) -> models.CSReport:
    if week_start is None:
        today = datetime.now(timezone.utc)
        week_start = today - timedelta(days=today.weekday(), hours=today.hour,
                                       minutes=today.minute, seconds=today.second,
                                       microseconds=today.microsecond)
    week_end = week_start + timedelta(weeks=1)

    rows = []
    for tier in ("enterprise", "business", "standard"):
        for priority in ("P1", "P2", "P3", "P4"):
            total = db.query(func.count(models.CSTicket.ticket_id)).filter(
                models.CSTicket.created_at >= week_start,
                models.CSTicket.created_at < week_end,
                models.CSTicket.account_tier == tier,
                models.CSTicket.priority == priority,
            ).scalar() or 0

            breached = db.query(func.count(models.CSTicket.ticket_id)).filter(
                models.CSTicket.created_at >= week_start,
                models.CSTicket.created_at < week_end,
                models.CSTicket.account_tier == tier,
                models.CSTicket.priority == priority,
                or_(
                    models.CSTicket.sla_first_response_breached.is_(True),
                    models.CSTicket.sla_resolution_breached.is_(True),
                ),
            ).scalar() or 0

            compliance = round((1 - breached / total) * 100, 1) if total > 0 else None
            rows.append({"tier": tier, "priority": priority,
                         "total": total, "breached": breached, "compliance_pct": compliance})

    avg_fr = db.query(
        func.avg(
            func.extract("epoch", models.CSTicket.first_responded_at - models.CSTicket.created_at) / 60
        )
    ).filter(
        models.CSTicket.created_at >= week_start,
        models.CSTicket.created_at < week_end,
        models.CSTicket.first_responded_at.isnot(None),
    ).scalar()

    avg_res = db.query(
        func.avg(
            func.extract("epoch", models.CSTicket.resolved_at - models.CSTicket.created_at) / 3600
        )
    ).filter(
        models.CSTicket.created_at >= week_start,
        models.CSTicket.created_at < week_end,
        models.CSTicket.resolved_at.isnot(None),
    ).scalar()

    data = {
        "week_start": week_start.date().isoformat(),
        "by_tier_priority": rows,
        "avg_first_response_minutes": round(float(avg_fr), 1) if avg_fr else None,
        "avg_resolution_hours": round(float(avg_res), 2) if avg_res else None,
    }
    return _store("weekly_sla", week_start, week_end, data, db)


# ─── R-03  CSAT Report ───────────────────────────────────────────────────────

def generate_csat_report(db: Session, period_start: datetime, period_end: datetime) -> models.CSReport:
    avg = db.query(func.avg(models.CSCSATSurvey.rating)).filter(
        models.CSCSATSurvey.responded_at >= period_start,
        models.CSCSATSurvey.responded_at < period_end,
    ).scalar()

    by_priority: dict[str, float | None] = {}
    for p in ("P1", "P2", "P3", "P4"):
        val = db.query(func.avg(models.CSCSATSurvey.rating)).join(
            models.CSTicket, models.CSCSATSurvey.ticket_id == models.CSTicket.ticket_id
        ).filter(
            models.CSCSATSurvey.responded_at >= period_start,
            models.CSCSATSurvey.responded_at < period_end,
            models.CSTicket.priority == p,
        ).scalar()
        by_priority[p] = round(float(val), 2) if val else None

    data = {
        "period_start": period_start.date().isoformat(),
        "period_end": period_end.date().isoformat(),
        "avg_csat": round(float(avg), 2) if avg else None,
        "avg_csat_by_priority": by_priority,
    }
    return _store("weekly_csat", period_start, period_end, data, db)


# ─── R-04  Ticket Ageing & Escalation Report ─────────────────────────────────

def generate_ticket_ageing(db: Session) -> models.CSReport:
    now = datetime.now(timezone.utc)

    buckets = {"0-3d": 0, "4-7d": 0, "8-14d": 0, "15+d": 0}
    open_tickets = db.query(models.CSTicket).filter(
        models.CSTicket.status.notin_(["closed", "customer_confirmed"])
    ).all()

    for t in open_tickets:
        age = (now - t.created_at).days
        if age <= 3:
            buckets["0-3d"] += 1
        elif age <= 7:
            buckets["4-7d"] += 1
        elif age <= 14:
            buckets["8-14d"] += 1
        else:
            buckets["15+d"] += 1

    escalation_count = db.query(func.count(models.CSHILReview.hil_id)).filter(
        models.CSHILReview.created_at >= now - timedelta(days=30)
    ).scalar() or 0

    data = {
        "generated_at": now.isoformat(),
        "open_ticket_age_buckets": buckets,
        "escalations_last_30d": escalation_count,
    }
    period_start = now - timedelta(days=30)
    return _store("ticket_ageing", period_start, now, data, db)


# ─── R-05  Monthly VoC + KB Effectiveness ────────────────────────────────────

def generate_monthly_voc(db: Session, month_start: datetime) -> models.CSReport:
    month_end = month_start + timedelta(days=31)
    month_end = month_end.replace(day=1)  # first of next month

    at_risk_count = db.query(func.count(models.CSCustomer.customer_id)).filter(
        models.CSCustomer.at_risk_flag.is_(True)
    ).scalar() or 0

    kb_published = db.query(func.count(models.CSKBArticle.article_id)).filter(
        models.CSKBArticle.published_at >= month_start,
        models.CSKBArticle.published_at < month_end,
    ).scalar() or 0

    avg_csat = db.query(func.avg(models.CSCSATSurvey.rating)).filter(
        models.CSCSATSurvey.responded_at >= month_start,
        models.CSCSATSurvey.responded_at < month_end,
    ).scalar()

    data = {
        "month": month_start.strftime("%Y-%m"),
        "at_risk_customers": at_risk_count,
        "kb_articles_published": kb_published,
        "avg_csat": round(float(avg_csat), 2) if avg_csat else None,
    }
    return _store("monthly_voc", month_start, month_end, data, db)
