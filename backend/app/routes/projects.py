from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.project_service import ProjectService
from app.core.security import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def get_projects():
    return ProjectService.get_all_projects()

@router.get("/slug/{slug}", response_model=ProjectResponse)
def get_project_by_slug(slug: str):
    project = ProjectService.get_project_by_slug(slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/{id}", response_model=ProjectResponse)
def get_project(id: str):
    project = ProjectService.get_project_by_id(id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    return ProjectService.create_project(payload.model_dump())

@router.patch("/{id}", response_model=ProjectResponse)
def update_project(
    id: str,
    payload: ProjectUpdate,
    current_user: dict = Depends(get_current_user)
):
    updated = ProjectService.update_project(id, payload.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    success = ProjectService.delete_project(id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
