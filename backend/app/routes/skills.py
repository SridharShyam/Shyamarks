from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse
from app.services.skill_service import SkillService
from app.core.security import get_current_user, get_optional_user

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillResponse])
def get_skills(current_user: Optional[dict] = Depends(get_optional_user)):
    public_only = False if current_user else True
    return SkillService.get_all_skills(public_only=public_only)

@router.get("/{id}", response_model=SkillResponse)
def get_skill(id: str, current_user: Optional[dict] = Depends(get_optional_user)):
    public_only = False if current_user else True
    skill = SkillService.get_skill_by_id(id, public_only=public_only)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    payload: SkillCreate,
    current_user: dict = Depends(get_current_user)
):
    return SkillService.create_skill(payload.model_dump())

@router.patch("/{id}", response_model=SkillResponse)
def update_skill(
    id: str,
    payload: SkillUpdate,
    current_user: dict = Depends(get_current_user)
):
    updated = SkillService.update_skill(id, payload.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Skill not found")
    return updated

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    success = SkillService.delete_skill(id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    return None
