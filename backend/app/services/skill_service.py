from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from bson import ObjectId
from app.core.database import get_db
from app.utils.ccs import calculate_ccs_for_skill
from app.utils.validators import validate_object_id, serialize_mongo_doc

class SkillService:
    @staticmethod
    def get_all_skills(public_only: bool = True) -> List[dict]:
        db = get_db()
        skills = list(db.skills.find().sort("name", 1))

        # Query referenced evidence for CCS calculation
        ach_query = {"visibility": "public"} if public_only else {}
        achievements = list(db.achievements.find(ach_query))
        projects = list(db.projects.find({}))
        experiences = list(db.experiences.find({}))

        enriched_skills = []
        for skill_doc in skills:
            doc = serialize_mongo_doc(skill_doc)
            skill_id = doc["id"]
            
            ccs_info = calculate_ccs_for_skill(skill_id, achievements, projects, experiences)
            doc["ccs"] = ccs_info["ccs"]
            doc["evidence_breadth_gap"] = ccs_info["evidence_breadth_gap"]
            doc["unanchored"] = ccs_info["unanchored"]
            doc["evidence_breakdown"] = ccs_info["evidence_breakdown"]
            
            enriched_skills.append(doc)

        return enriched_skills

    @staticmethod
    def get_skill_by_id(skill_id: str, public_only: bool = True) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(skill_id)
        skill_doc = db.skills.find_one({"_id": oid})
        if not skill_doc:
            return None

        doc = serialize_mongo_doc(skill_doc)
        ach_query = {"visibility": "public"} if public_only else {}
        achievements = list(db.achievements.find(ach_query))
        projects = list(db.projects.find({}))
        experiences = list(db.experiences.find({}))

        ccs_info = calculate_ccs_for_skill(doc["id"], achievements, projects, experiences)
        doc["ccs"] = ccs_info["ccs"]
        doc["evidence_breadth_gap"] = ccs_info["evidence_breadth_gap"]
        doc["unanchored"] = ccs_info["unanchored"]
        doc["evidence_breakdown"] = ccs_info["evidence_breakdown"]

        return doc

    @staticmethod
    def create_skill(data: dict) -> dict:
        db = get_db()
        data["created_at"] = datetime.now(timezone.utc)
        
        # Check duplicate name
        if db.skills.find_one({"name": {"$regex": f"^{data['name']}$", "$options": "i"}}):
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=f"Skill with name '{data['name']}' already exists.")

        res = db.skills.insert_one(data)
        created_doc = db.skills.find_one({"_id": res.inserted_id})
        return SkillService.get_skill_by_id(str(created_doc["_id"]), public_only=False)

    @staticmethod
    def update_skill(skill_id: str, update_data: dict) -> Optional[dict]:
        db = get_db()
        oid = validate_object_id(skill_id)
        clean_update = {k: v for k, v in update_data.items() if v is not None}
        
        if "name" in clean_update:
            existing = db.skills.find_one({"name": {"$regex": f"^{clean_update['name']}$", "$options": "i"}, "_id": {"$ne": oid}})
            if existing:
                from fastapi import HTTPException
                raise HTTPException(status_code=400, detail=f"Skill with name '{clean_update['name']}' already exists.")

        db.skills.update_one({"_id": oid}, {"$set": clean_update})
        return SkillService.get_skill_by_id(skill_id, public_only=False)

    @staticmethod
    def delete_skill(skill_id: str) -> bool:
        db = get_db()
        oid = validate_object_id(skill_id)
        res = db.skills.delete_one({"_id": oid})
        return res.deleted_count > 0
