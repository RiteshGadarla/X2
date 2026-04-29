from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import user as user_schemas

router = APIRouter()

@router.get("/", response_model=List[user_schemas.UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.CSUser).offset(skip).limit(limit).all()

@router.get("/{user_id}", response_model=user_schemas.UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(models.CSUser).filter(models.CSUser.user_id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=user_schemas.UserResponse)
def create_user(user_in: user_schemas.UserCreate, db: Session = Depends(get_db)):
    user = models.CSUser(**user_in.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/{user_id}", response_model=user_schemas.UserResponse)
def update_user(user_id: UUID, update_data: user_schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.CSUser).filter(models.CSUser.user_id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(models.CSUser).filter(models.CSUser.user_id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"status": "deleted"}
