from fastapi import APIRouter, HTTPException
from services.seed_service import seed_db

router = APIRouter()

@router.post("/32")
@router.get("/32")  # Adding GET just in case the user pings it directly in browser
def run_seed():
    try:
        count = seed_db()
        return {"status": "success", "message": f"Database wiped and successfully seeded with {count} tickets."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")
