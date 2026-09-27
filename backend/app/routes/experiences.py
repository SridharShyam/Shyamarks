from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from app.services.experience_service import ExperienceService
from app.core.security import get_current_user

router = APIRouter(prefix="/experiences", tags=["Experiences"])

@router.get("", response_model=List[ExperienceResponse])
def get_experiences():
    return ExperienceService.get_all_experiences()

@router.get("/{id}", response_model=ExperienceResponse)
def get_experience(id: str):
    exp = ExperienceService.get_experience_by_id(id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return exp

@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experience(
    payload: ExperienceCreate,
    current_user: dict = Depends(get_current_user)
):
    return ExperienceService.create_experience(payload.model_dump())

@router.patch("/{id}", response_model=ExperienceResponse)
def update_experience(
    id: str,
    payload: ExperienceUpdate,
    current_user: dict = Depends(get_current_user)
):
    updated = ExperienceService.update_experience(id, payload.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Experience not found")
    return updated

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    success = ExperienceService.delete_experience(id)
    if not success:
        raise HTTPException(status_code=404, detail="Experience not found")
    return None
