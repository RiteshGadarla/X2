from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy.orm import Session
import models


def log_event(
    entity_type: str,
    entity_id: str,
    action: str,
    db: Session,
    actor_id: str = "system",
    actor_type: str = "system",
    old_value: Optional[dict] = None,
    new_value: Optional[dict] = None,
    ip_address: Optional[str] = None,
) -> models.CSAuditLog:
    entry = models.CSAuditLog(
        entity_type=entity_type,
        entity_id=str(entity_id),
        action=action,
        actor_id=str(actor_id),
        actor_type=actor_type,
        old_value=old_value,
        new_value=new_value,
        ip_address=ip_address,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(entry)
    return entry
