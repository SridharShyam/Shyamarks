import uuid
import re
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.core.database import get_db, serialize_doc, serialize_docs
from app.core.security import get_current_user

router = APIRouter(prefix="/share-packs", tags=["Share Packs"])

STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he",
    "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will",
    "with", "or", "you", "your", "our", "this", "we", "can", "should", "have", "must"
}

class SharePackCreateRequest(BaseModel):
    jd_text: str
    expires_hours: int = Field(default=72, ge=1, le=168)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_share_pack(
    payload: SharePackCreateRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    
    # 1. Extract keywords from jd_text
    raw_words = re.findall(r'[a-zA-Z0-9+#.-]+', payload.jd_text.lower())
    keywords = sorted(list(set(
        w for w in raw_words
        if len(w) >= 3 and w not in STOPWORDS
    )))

    # 2. Query matching public achievements
    if keywords:
        regex_pattern = "|".join(re.escape(k) for k in keywords[:25])
        ach_query = {
            "visibility": "public",
            "$or": [
                {"title": {"$regex": regex_pattern, "$options": "i"}},
                {"description": {"$regex": regex_pattern, "$options": "i"}},
                {"tags": {"$regex": regex_pattern, "$options": "i"}},
            ]
        }
    else:
        ach_query = {"visibility": "public"}

    matched_achs = list(db.achievements.find(ach_query))
    ach_ids = [a["_id"] for a in matched_achs]

    # Collect skill_ids from matched achievements
    skill_ids_set = set()
    for a in matched_achs:
        for sid in a.get("skill_ids", []):
            try:
                from bson import ObjectId
                skill_ids_set.add(ObjectId(sid) if isinstance(sid, str) else sid)
            except Exception:
                pass

    # Query matching skills by name
    if keywords:
        skill_matches = list(db.skills.find({
            "name": {"$regex": "|".join(re.escape(k) for k in keywords[:20]), "$options": "i"}
        }))
        for s in skill_matches:
            skill_ids_set.add(s["_id"])

    matched_skills = list(db.skills.find({"_id": {"$in": list(skill_ids_set)}}))
    skill_ids = [s["_id"] for s in matched_skills]

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=payload.expires_hours)
    token = uuid.uuid4().hex

    doc = {
        "token": token,
        "jd_text": payload.jd_text,
        "jd_keywords": keywords[:20],
        "achievement_ids": ach_ids,
        "skill_ids": skill_ids,
        "created_at": now,
        "expires_at": expires_at,
        "view_count": 0
    }

    db.share_packs.insert_one(doc)

    return {
        "token": token,
        "url": f"/share/{token}",
        "expires_at": expires_at.isoformat(),
        "matched_achievements_count": len(ach_ids),
        "matched_skills_count": len(skill_ids)
    }

@router.get("/{token}")
def get_share_pack(token: str):
    db = get_db()
    pack = db.share_packs.find_one({"token": token})
    if not pack:
        raise HTTPException(status_code=404, detail="Share pack not found.")

    now = datetime.now(timezone.utc)
    expires_at = pack["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now > expires_at:
        raise HTTPException(status_code=410, detail="This share pack has expired.")

    # Increment view count
    db.share_packs.update_one({"_id": pack["_id"]}, {"$inc": {"view_count": 1}})

    # Fetch achievements and skills
    achievements = list(db.achievements.find({
        "_id": {"$in": pack.get("achievement_ids", [])},
        "visibility": "public"
    }))

    skills = list(db.skills.find({
        "_id": {"$in": pack.get("skill_ids", [])}
    }))

    return {
        "achievements": serialize_docs(achievements),
        "skills": serialize_docs(skills),
        "expires_at": expires_at.isoformat(),
        "jd_keywords": pack.get("jd_keywords", []),
        "view_count": pack.get("view_count", 0) + 1
    }
