from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum

class AchievementType(str, Enum):
    CERTIFICATION = "Certification"
    INTERNSHIP = "Internship"
    VIRTUAL_EXPERIENCE = "Virtual Experience"
    WORKSHOP = "Workshop"
    COURSE = "Course"
    COMPETITION = "Competition"
    AWARD = "Award"
    PROJECT = "Project"
    PUBLICATION = "Publication"
    HACKATHON = "Hackathon"
    TRAINING = "Training"
    OTHER = "Other"

class VisibilityType(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    UNLISTED = "unlisted"

class AchievementBase(BaseModel):
    title: str
    type: AchievementType
    description: str
    issuer_id: Optional[str] = None
    issued_date: str
    expiry_date: Optional[str] = None
    skill_ids: List[str] = []
    project_ids: List[str] = []
    experience_ids: List[str] = []
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None
    credential_url: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    preview_image_url: Optional[str] = None
    visibility: VisibilityType = VisibilityType.PUBLIC
    featured: bool = False
    slug: Optional[str] = None
    tags: List[str] = []

class AchievementCreate(AchievementBase):
    pass

class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[AchievementType] = None
    description: Optional[str] = None
    issuer_id: Optional[str] = None
    issued_date: Optional[str] = None
    expiry_date: Optional[str] = None
    skill_ids: Optional[List[str]] = None
    project_ids: Optional[List[str]] = None
    experience_ids: Optional[List[str]] = None
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None
    credential_url: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    preview_image_url: Optional[str] = None
    visibility: Optional[VisibilityType] = None
    featured: Optional[bool] = None
    slug: Optional[str] = None
    tags: Optional[List[str]] = None

class AchievementResponse(AchievementBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    issuer: Optional[Any] = None
    skills: Optional[List[Any]] = None
    projects: Optional[List[Any]] = None
    experiences: Optional[List[Any]] = None

    class Config:
        from_attributes = True

class AchievementPaginatedResponse(BaseModel):
    items: List[AchievementResponse]
    total: int
    page: int
    limit: int
    total_pages: int
