from fastapi import APIRouter
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from app.services.achievement_service import AchievementService
from app.services.skill_service import SkillService
from app.utils.path_inference import infer_learning_paths

router = APIRouter(prefix="/learning-paths", tags=["Learning Paths"])

# 5-minute in-memory cache
_CACHE = {
    "data": None,
    "expires_at": None
}

@router.get("", response_model=List[Dict[str, Any]])
def get_learning_paths():
    now = datetime.now(timezone.utc)
    if _CACHE["data"] is not None and _CACHE["expires_at"] and now < _CACHE["expires_at"]:
        return _CACHE["data"]

    # Fetch public achievements and skills
    ach_res = AchievementService.get_achievements(limit=1000, visibility_filter=["public"])
    achievements = ach_res.get("items", [])
    skills = SkillService.get_all_skills(public_only=True)

    paths = infer_learning_paths(achievements, skills)

    _CACHE["data"] = paths
    _CACHE["expires_at"] = now + timedelta(minutes=5)
    return paths
