from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    slug: Optional[str] = None
    skill_ids: List[str] = []
    achievement_ids: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    tags: List[str] = []

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None
    skill_ids: Optional[List[str]] = None
    achievement_ids: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    tags: Optional[List[str]] = None

class ProjectResponse(ProjectBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
