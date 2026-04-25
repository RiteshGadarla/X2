from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Role, RolePermission

router = APIRouter()


@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(Role).all()
    return {"roles": [{"id": r.id, "name": r.name} for r in roles]}


@router.get("/roles/{role_id}/permissions")
def get_permissions(role_id: str, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    perms = db.query(RolePermission).filter(RolePermission.role_id == role_id).all()
    return {"permissions": [p.permission for p in perms]}
