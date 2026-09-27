from fastapi import APIRouter, HTTPException
from app.schemas.achievement import AchievementResponse
from app.services.achievement_service import AchievementService

router = APIRouter(tags=["Verification"])

@router.get("/verify/{fingerprint}", response_model=AchievementResponse)
def verify_fingerprint(fingerprint: str):
    achievement = AchievementService.get_by_fingerprint(fingerprint)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement
