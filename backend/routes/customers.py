from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import customer as customer_schemas
from services import customer_service

router = APIRouter()

@router.post("/", response_model=customer_schemas.CustomerResponse)
def create_customer(customer_in: customer_schemas.CustomerCreate, db: Session = Depends(get_db)):
    return customer_service.create_customer(db, customer_in)

@router.get("/", response_model=List[customer_schemas.CustomerResponse])
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return customer_service.get_customers(db, skip=skip, limit=limit)

@router.get("/{customer_id}", response_model=customer_schemas.CustomerResponse)
def get_customer(customer_id: UUID, db: Session = Depends(get_db)):
    customer = customer_service.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.patch("/{customer_id}", response_model=customer_schemas.CustomerResponse)
def update_customer(customer_id: UUID, update_data: customer_schemas.CustomerUpdate, db: Session = Depends(get_db)):
    try:
        return customer_service.update_customer(db, customer_id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

import models

@router.put("/{customer_id}", response_model=customer_schemas.CustomerResponse)
def full_update_customer(customer_id: UUID, update_data: customer_schemas.CustomerUpdate, db: Session = Depends(get_db)):
    try:
        return customer_service.update_customer(db, customer_id, update_data)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{customer_id}")
def delete_customer(customer_id: UUID, db: Session = Depends(get_db)):
    customer = db.query(models.CSCustomer).filter(models.CSCustomer.customer_id == customer_id).first()
    if not customer: raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"status": "deleted"}
