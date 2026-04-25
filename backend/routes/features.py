from fastapi import APIRouter
from mock_data import (
    MOCK_TICKETS,
    MOCK_HIL_QUEUE,
    MOCK_KB_STATS,
    MOCK_VOC,
    MOCK_CHANNEL_VOL,
    MOCK_LEGAL_OVERVIEW,
    MOCK_CUSTOMER_PORTAL,
<<<<<<< HEAD
=======
    MOCK_ACTIVITY_LOGS,
>>>>>>> master
)

router = APIRouter()

@router.get("/tickets")
def get_tickets():
    return {"tickets": MOCK_TICKETS}

@router.get("/hil")
def get_hil_queue():
    return {"queue": MOCK_HIL_QUEUE}

@router.get("/kb")
def get_kb_stats():
    return MOCK_KB_STATS

@router.get("/voc")
def get_voc():
    return MOCK_VOC

@router.get("/channels")
def get_channels():
    return MOCK_CHANNEL_VOL

@router.get("/legal-overview")
def get_legal_overview():
    return MOCK_LEGAL_OVERVIEW

@router.get("/customer-portal")
def get_customer_portal():
    return MOCK_CUSTOMER_PORTAL
<<<<<<< HEAD
=======

@router.get("/logs")
def get_activity_logs():
    return {"logs": MOCK_ACTIVITY_LOGS}
>>>>>>> master
