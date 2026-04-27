"""
SLA deadline calculation, status evaluation, and alert creation.

Default SLA matrix (overridden by cs_sla_configs rows if present):
  tier        P1      P2      P3      P4    (first_response_minutes / resolution_hours)
  enterprise  15/4    60/8    240/24  480/72
  business    15/8    60/24   240/48  480/120
  standard    15/24   60/48   240/96  480/168
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session
import models

_DEFAULTS: dict[tuple[str, str], dict[str, int]] = {
    ("enterprise", "P1"): {"fr": 15,  "res": 4},
    ("enterprise", "P2"): {"fr": 60,  "res": 8},
    ("enterprise", "P3"): {"fr": 240, "res": 24},
    ("enterprise", "P4"): {"fr": 480, "res": 72},
    ("business",   "P1"): {"fr": 15,  "res": 8},
    ("business",   "P2"): {"fr": 60,  "res": 24},
    ("business",   "P3"): {"fr": 240, "res": 48},
    ("business",   "P4"): {"fr": 480, "res": 120},
    ("standard",   "P1"): {"fr": 15,  "res": 24},
    ("standard",   "P2"): {"fr": 60,  "res": 48},
    ("standard",   "P3"): {"fr": 240, "res": 96},
    ("standard",   "P4"): {"fr": 480, "res": 168},
}


def _lookup_sla(tier: str, priority: str, db: Session) -> tuple[int, int]:
    """Return (first_response_minutes, resolution_hours) from DB or defaults."""
    cfg = (
        db.query(models.CSSLAConfig)
        .filter(
            models.CSSLAConfig.customer_tier == tier,
            models.CSSLAConfig.priority == priority,
            models.CSSLAConfig.is_active.is_(True),
        )
        .first()
    )
    if cfg:
        return cfg.first_response_minutes, cfg.resolution_hours
    fallback = _DEFAULTS.get((tier, priority), {"fr": 480, "res": 168})
    return fallback["fr"], fallback["res"]


def assign_sla_deadlines(ticket: models.CSTicket, db: Session) -> models.CSTicket:
    """Stamp SLA due timestamps on a newly created (or re-prioritised) ticket."""
    if not ticket.priority or not ticket.account_tier:
        return ticket
    fr_min, res_hr = _lookup_sla(ticket.account_tier, ticket.priority, db)
    now = datetime.now(timezone.utc)
    ticket.sla_first_response_due = now + timedelta(minutes=fr_min)
    ticket.sla_resolution_due = now + timedelta(hours=res_hr)
    return ticket


def get_sla_status(ticket: models.CSTicket) -> dict:
    """
    Return a structured SLA status dict for both first_response and resolution.
    status values: ok | warning | critical | breached | met
    """
    now = datetime.now(timezone.utc)

    def _window(due: Optional[datetime], resolved_at: Optional[datetime], created_at: datetime) -> dict:
        if due is None:
            return {"due": None, "pct_elapsed": None, "status": "not_configured"}
        if resolved_at:
            return {"due": due, "pct_elapsed": 100.0, "status": "met"}
        total = (due - created_at).total_seconds()
        elapsed = (now - created_at).total_seconds()
        pct = round((elapsed / total * 100), 1) if total > 0 else 100.0
        if pct >= 100:
            status = "breached"
        elif pct >= 90:
            status = "critical"
        elif pct >= 75:
            status = "warning"
        else:
            status = "ok"
        return {"due": due, "pct_elapsed": pct, "status": status}

    return {
        "first_response": _window(
            ticket.sla_first_response_due,
            ticket.first_responded_at,
            ticket.created_at,
        ),
        "resolution": _window(
            ticket.sla_resolution_due,
            ticket.resolved_at,
            ticket.created_at,
        ),
    }


_ALERT_THRESHOLDS = {
    "warning": 75,
    "critical": 90,
    "breach": 100,
}


def check_and_raise_alerts(ticket: models.CSTicket, db: Session) -> list[models.CSSLAAlert]:
    """Create SLA alert rows for any new threshold crossings; update breach flags."""
    sla = get_sla_status(ticket)
    created: list[models.CSSLAAlert] = []

    for sla_type, key in [("first_response", "first_response"), ("resolution", "resolution")]:
        status_val = sla[key]["status"]
        if status_val not in ("warning", "critical", "breached"):
            continue
        alert_type = "breach" if status_val == "breached" else status_val
        # De-duplicate: one alert per (ticket, sla_type, alert_type)
        exists = (
            db.query(models.CSSLAAlert)
            .filter(
                models.CSSLAAlert.ticket_id == ticket.ticket_id,
                models.CSSLAAlert.sla_type == sla_type,
                models.CSSLAAlert.alert_type == alert_type,
            )
            .first()
        )
        if exists:
            continue
        alert = models.CSSLAAlert(
            ticket_id=ticket.ticket_id,
            alert_type=alert_type,
            sla_type=sla_type,
            threshold_pct=_ALERT_THRESHOLDS.get(alert_type),
        )
        db.add(alert)
        created.append(alert)
        if alert_type == "breach":
            if sla_type == "first_response":
                ticket.sla_first_response_breached = True
            else:
                ticket.sla_resolution_breached = True

    return created
