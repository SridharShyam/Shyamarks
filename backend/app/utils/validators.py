from bson import ObjectId
from fastapi import HTTPException

def validate_object_id(id_str: str) -> ObjectId:
    if not ObjectId.is_valid(id_str):
        raise HTTPException(status_code=400, detail=f"Invalid ObjectId format: {id_str}")
    return ObjectId(id_str)

def serialize_mongo_doc(doc: dict) -> dict:
    if not doc:
        return doc
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    for key, val in doc.items():
        if isinstance(val, ObjectId):
            doc[key] = str(val)
        elif isinstance(val, list):
            doc[key] = [str(item) if isinstance(item, ObjectId) else item for item in val]
    return doc
