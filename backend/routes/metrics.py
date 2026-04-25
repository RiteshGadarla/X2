from fastapi import APIRouter, HTTPException
from mock_data import MOCK_METRICS

router = APIRouter()

@router.get("/{role_id}")
def get_metrics(role_id: str):
    if role_id not in MOCK_METRICS:
        # Default metrics if role unmapped in mock
        return {"metrics": {"status": "No specific metrics defined for this role"}}
    return {"metrics": MOCK_METRICS[role_id]}
