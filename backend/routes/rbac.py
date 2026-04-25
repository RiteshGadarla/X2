from fastapi import APIRouter, HTTPException
from mock_data import ROLES, ROLE_PERMISSIONS

router = APIRouter()

@router.get("/roles")
def get_roles():
    return {"roles": ROLES}

@router.get("/roles/{role_id}/permissions")
def get_permissions(role_id: str):
    if role_id not in ROLE_PERMISSIONS:
        raise HTTPException(status_code=404, detail="Role not found")
    return {"permissions": ROLE_PERMISSIONS[role_id]}
