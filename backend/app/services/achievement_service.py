from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from bson import ObjectId
from app.core.database import get_db
from app.utils.slug import slugify
from app.utils.validators import validate_object_id, serialize_mongo_doc

class AchievementService:
    @staticmethod
    def populate_relations(achievement: dict, db) -> dict:
        doc = serialize_mongo_doc(achievement)
        
        # Issuer
        if doc.get("issuer_id"):
            try:
                issuer = db.issuers.find_one({"_id": ObjectId(doc["issuer_id"])})
                doc["issuer"] = serialize_mongo_doc(issuer) if issuer else None
            except Exception:
                doc["issuer"] = None

        # Skills
        skill_ids = doc.get("skill_ids", [])
        if skill_ids:
            try:
                valid_ids = [ObjectId(sid) for sid in skill_ids if ObjectId.is_valid(sid)]
                skills = list(db.skills.find({"_id": {"$in": valid_ids}}))
                doc["skills"] = [serialize_mongo_doc(s) for s in skills]
            except Exception:
                doc["skills"] = []
        else:
            doc["skills"] = []

        # Projects
        project_ids = doc.get("project_ids", [])
        if project_ids:
            try:
                valid_ids = [ObjectId(pid) for pid in project_ids if ObjectId.is_valid(pid)]
                projects = list(db.projects.find({"_id": {"$in": valid_ids}}))
                doc["projects"] = [serialize_mongo_doc(p) for p in projects]
            except Exception:
                doc["projects"] = []
        else:
            doc["projects"] = []

        # Experiences
        exp_ids = doc.get("experience_ids", [])
        if exp_ids:
            try:
                valid_ids = [ObjectId(eid) for eid in exp_ids if ObjectId.is_valid(eid)]
                exps = list(db.experiences.find({"_id": {"$in": valid_ids}}))
                doc["experiences"] = [serialize_mongo_doc(e) for e in exps]
            except Exception:
                doc["experiences"] = []
        else:
            doc["experiences"] = []

        return doc

    @staticmethod
    def get_achievements(
        search: Optional[str] = None,
        type_filter: Optional[str] = None,
        issuer_id: Optional[str] = None,
        skill_id: Optional[str] = None,
        year: Optional[int] = None,
        featured: Optional[bool] = None,
        visibility_filter: Optional[List[str]] = None,
        sort_by: str = "newest",
        page: int = 1,
        limit: int = 12
    ) -> Dict[str, Any]:
        db = get_db()
        query = {}

        if visibility_filter:
            query["visibility"] = {"$in": visibility_filter}

        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}}
            ]

        if type_filter:
            query["type"] = type_filter

        if issuer_id:
            query["issuer_id"] = issuer_id

        if skill_id:
            query["skill_ids"] = skill_id

        if featured is not None:
            query["featured"] = featured

        if year:
            query["issued_date"] = {"$regex": f"^{year}"}

        # Sorting
        if sort_by == "oldest":
            sort_order = [("issued_date", 1), ("created_at", 1)]
        elif sort_by == "title":
            sort_order = [("title", 1)]
        else:  # newest
            sort_order = [("issued_date", -1), ("created_at", -1)]

        total = db.achievements.count_documents(query)
        skip = (page - 1) * limit
        cursor = db.achievements.find(query).sort(sort_order).skip(skip).limit(limit)

        items = [AchievementService.populate_relations(doc, db) for doc in cursor]
        total_pages = (total + limit - 1) // limit if limit > 0 else 1

        return {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }

    @staticmethod
    def get_by_id(achievement_id: str, allowed_visibilities: Optional[List[str]] = None) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(achievement_id)
        query = {"_id": oid}
        if allowed_visibilities:
            query["visibility"] = {"$in": allowed_visibilities}
        doc = db.achievements.find_one(query)
        if not doc:
            return None
        return AchievementService.populate_relations(doc, db)

    @staticmethod
    def get_by_slug(slug: str, allowed_visibilities: Optional[List[str]] = None) -> Optional[dict]:
        db = get_db()
        query = {"slug": slug}
        if allowed_visibilities:
            query["visibility"] = {"$in": allowed_visibilities}
        doc = db.achievements.find_one(query)
        if not doc:
            return None
        return AchievementService.populate_relations(doc, db)

    @staticmethod
    def create_achievement(data: dict) -> dict:
        db = get_db()
        now = datetime.now(timezone.utc)
        data["created_at"] = now
        data["updated_at"] = now

        if not data.get("slug"):
            data["slug"] = slugify(data.get("title", "achievement"))
        
        # Ensure unique slug
        base_slug = data["slug"]
        counter = 1
        while db.achievements.find_one({"slug": data["slug"]}):
            data["slug"] = f"{base_slug}-{counter}"
            counter += 1

        res = db.achievements.insert_one(data)
        created_doc = db.achievements.find_one({"_id": res.inserted_id})
        return AchievementService.populate_relations(created_doc, db)

    @staticmethod
    def update_achievement(achievement_id: str, update_data: dict) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(achievement_id)
        
        # Clean null update keys
        clean_update = {k: v for k, v in update_data.items() if v is not None}
        if not clean_update:
            existing = db.achievements.find_one({"_id": oid})
            return AchievementService.populate_relations(existing, db) if existing else None

        clean_update["updated_at"] = datetime.now(timezone.utc)

        if "title" in clean_update and "slug" not in clean_update:
            base_slug = slugify(clean_update["title"])
            slug = base_slug
            counter = 1
            while True:
                conflict = db.achievements.find_one({"slug": slug, "_id": {"$ne": oid}})
                if not conflict:
                    break
                slug = f"{base_slug}-{counter}"
                counter += 1
            clean_update["slug"] = slug

        db.achievements.update_one({"_id": oid}, {"$set": clean_update})
        updated_doc = db.achievements.find_one({"_id": oid})
        return AchievementService.populate_relations(updated_doc, db) if updated_doc else None

    @staticmethod
    def delete_achievement(achievement_id: str) -> bool:
        db = get_db()
        oid = validate_object_id(achievement_id)
        res = db.achievements.delete_one({"_id": oid})
        return res.deleted_count > 0
