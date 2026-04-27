from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
import models
from schemas import customer as customer_schemas

def create_customer(db: Session, customer_in: customer_schemas.CustomerCreate) -> models.CSCustomer:
    db_customer = models.CSCustomer(**customer_in.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customer(db: Session, customer_id: UUID) -> Optional[models.CSCustomer]:
    return db.query(models.CSCustomer).filter(models.CSCustomer.customer_id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100) -> List[models.CSCustomer]:
    return db.query(models.CSCustomer).order_by(models.CSCustomer.created_at.desc()).offset(skip).limit(limit).all()

def update_customer(db: Session, customer_id: UUID, update_data: customer_schemas.CustomerUpdate) -> models.CSCustomer:
    customer = get_customer(db, customer_id)
    if not customer:
        raise ValueError("Customer not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(customer, key, value)
        
    db.commit()
    db.refresh(customer)
    return customer
