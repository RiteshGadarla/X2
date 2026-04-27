from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

router = APIRouter()

class SQLRequest(BaseModel):
    password: str
    sql: str

@router.post("/execute-sql")
def execute_sql(body: SQLRequest, db: Session = Depends(get_db)):
    """
    Highly privileged route to execute arbitrary SQL commands.
    Secured with a static password as requested.
    """
    if body.password != "Welcome@123Luka":
        raise HTTPException(status_code=401, detail="Invalid password")
    
    try:
        # Execute the raw SQL command
        result = db.execute(text(body.sql))
        db.commit()
        
        # Determine rows affected if applicable
        try:
            row_count = result.rowcount
        except:
            row_count = 0
            
        return {
            "status": "success",
            "message": "SQL command executed successfully",
            "rows_affected": row_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"SQL Execution Error: {str(e)}")
