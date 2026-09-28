from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List
from app.schemas.achievement import (
    AchievementCreate, AchievementUpdate, AchievementResponse, AchievementPaginatedResponse
)
from app.services.achievement_service import AchievementService
from app.core.security import get_current_user, get_optional_user

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("", response_model=AchievementPaginatedResponse)
def list_achievements(
    search: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    issuer_id: Optional[str] = Query(None),
    skill_id: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    featured: Optional[bool] = Query(None),
    sort: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=10000),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    # Public endpoints return only public achievements unless admin
    visibility_filter = None if current_user else ["public"]
    res = AchievementService.get_achievements(
        search=search,
        type_filter=type,
        issuer_id=issuer_id,
        skill_id=skill_id,
        year=year,
        featured=featured,
        visibility_filter=visibility_filter,
        sort_by=sort,
        page=page,
        limit=limit
    )
    return res

@router.get("/slug/{slug}", response_model=AchievementResponse)
def get_achievement_by_slug(
    slug: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    allowed_visibilities = None if current_user else ["public", "unlisted"]
    achievement = AchievementService.get_by_slug(slug, allowed_visibilities=allowed_visibilities)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

@router.get("/{id}", response_model=AchievementResponse)
def get_achievement_by_id(
    id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    allowed_visibilities = None if current_user else ["public", "unlisted"]
    achievement = AchievementService.get_by_id(id, allowed_visibilities=allowed_visibilities)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

@router.post("", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
def create_achievement(
    payload: AchievementCreate,
    current_user: dict = Depends(get_current_user)
):
    return AchievementService.create_achievement(payload.model_dump())

@router.patch("/{id}", response_model=AchievementResponse)
def update_achievement(
    id: str,
    payload: AchievementUpdate,
    current_user: dict = Depends(get_current_user)
):
    updated = AchievementService.update_achievement(id, payload.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return updated

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    success = AchievementService.delete_achievement(id)
    if not success:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return None
