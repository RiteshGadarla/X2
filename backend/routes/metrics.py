from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Metric

router = APIRouter()


@router.get("/{role_id}")
def get_metrics(role_id: str, db: Session = Depends(get_db)):
    metric = db.query(Metric).filter(Metric.role_id == role_id).first()
    if not metric:
        return {"metrics": {"status": "No specific metrics defined for this role"}}
    return {"metrics": metric.data}
