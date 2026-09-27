from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId
from app.core.database import get_db
from app.utils.validators import validate_object_id, serialize_mongo_doc

class ExperienceService:
    @staticmethod
    def get_all_experiences() -> List[dict]:
        db = get_db()
        cursor = db.experiences.find().sort("start_date", -1)
        return [serialize_mongo_doc(doc) for doc in cursor]

    @staticmethod
    def get_experience_by_id(exp_id: str) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(exp_id)
        doc = db.experiences.find_one({"_id": oid})
        return serialize_mongo_doc(doc) if doc else None

    @staticmethod
    def create_experience(data: dict) -> dict:
        db = get_db()
        data["created_at"] = datetime.now(timezone.utc)
        res = db.experiences.insert_one(data)
        doc = db.experiences.find_one({"_id": res.inserted_id})
        return serialize_mongo_doc(doc)

    @staticmethod
    def update_experience(exp_id: str, update_data: dict) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(exp_id)
        clean_update = {k: v for k, v in update_data.items() if v is not None}
        db.experiences.update_one({"_id": oid}, {"$set": clean_update})
        doc = db.experiences.find_one({"_id": oid})
        return serialize_mongo_doc(doc) if doc else None

    @staticmethod
    def delete_experience(exp_id: str) -> bool:
        db = get_db()
        oid = validate_object_id(exp_id)
        res = db.experiences.delete_one({"_id": oid})
        return res.deleted_count > 0
