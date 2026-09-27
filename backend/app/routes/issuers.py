from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.schemas.issuer import IssuerCreate, IssuerUpdate, IssuerResponse
from app.core.database import get_db
from app.utils.validators import validate_object_id, serialize_mongo_doc
from app.core.security import get_current_user

router = APIRouter(prefix="/issuers", tags=["Issuers"])

@router.get("", response_model=List[IssuerResponse])
def get_issuers():
    db = get_db()
    cursor = db.issuers.find().sort("name", 1)
    return [serialize_mongo_doc(doc) for doc in cursor]

@router.get("/{id}", response_model=IssuerResponse)
def get_issuer(id: str):
    db = get_db()
    oid = validate_object_id(id)
    doc = db.issuers.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Issuer not found")
    return serialize_mongo_doc(doc)

@router.post("", response_model=IssuerResponse, status_code=status.HTTP_201_CREATED)
def create_issuer(
    payload: IssuerCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    data = payload.model_dump()
    data["created_at"] = datetime.now(timezone.utc)
    res = db.issuers.insert_one(data)
    doc = db.issuers.find_one({"_id": res.inserted_id})
    return serialize_mongo_doc(doc)

@router.patch("/{id}", response_model=IssuerResponse)
def update_issuer(
    id: str,
    payload: IssuerUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    oid = validate_object_id(id)
    clean_update = {k: v for k, v in payload.model_dump().items() if v is not None}
    db.issuers.update_one({"_id": oid}, {"$set": clean_update})
    doc = db.issuers.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Issuer not found")
    return serialize_mongo_doc(doc)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issuer(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    oid = validate_object_id(id)
    res = db.issuers.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Issuer not found")
    return None
