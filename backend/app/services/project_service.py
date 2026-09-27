from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId
from app.core.database import get_db
from app.utils.slug import slugify
from app.utils.validators import validate_object_id, serialize_mongo_doc

class ProjectService:
    @staticmethod
    def get_all_projects() -> List[dict]:
        db = get_db()
        cursor = db.projects.find().sort("created_at", -1)
        return [serialize_mongo_doc(doc) for doc in cursor]

    @staticmethod
    def get_project_by_id(project_id: str) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(project_id)
        doc = db.projects.find_one({"_id": oid})
        return serialize_mongo_doc(doc) if doc else None

    @staticmethod
    def get_project_by_slug(slug: str) -> Optional[dict]:
        db = get_db()
        doc = db.projects.find_one({"slug": slug})
        return serialize_mongo_doc(doc) if doc else None

    @staticmethod
    def create_project(data: dict) -> dict:
        db = get_db()
        data["created_at"] = datetime.now(timezone.utc)
        if not data.get("slug"):
            data["slug"] = slugify(data.get("title", "project"))
        
        base_slug = data["slug"]
        counter = 1
        while db.projects.find_one({"slug": data["slug"]}):
            data["slug"] = f"{base_slug}-{counter}"
            counter += 1

        res = db.projects.insert_one(data)
        doc = db.projects.find_one({"_id": res.inserted_id})
        return serialize_mongo_doc(doc)

    @staticmethod
    def update_project(project_id: str, update_data: dict) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(project_id)
        clean_update = {k: v for k, v in update_data.items() if v is not None}
        
        if "title" in clean_update and "slug" not in clean_update:
            base_slug = slugify(clean_update["title"])
            slug = base_slug
            counter = 1
            while True:
                conflict = db.projects.find_one({"slug": slug, "_id": {"$ne": oid}})
                if not conflict:
                    break
                slug = f"{base_slug}-{counter}"
                counter += 1
            clean_update["slug"] = slug

        db.projects.update_one({"_id": oid}, {"$set": clean_update})
        doc = db.projects.find_one({"_id": oid})
        return serialize_mongo_doc(doc) if doc else None

    @staticmethod
    def delete_project(project_id: str) -> bool:
        db = get_db()
        oid = validate_object_id(project_id)
        res = db.projects.delete_one({"_id": oid})
        return res.deleted_count > 0
