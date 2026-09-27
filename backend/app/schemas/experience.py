from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ExperienceType(str, Enum):
    INTERNSHIP = "Internship"
    RESEARCH = "Research"
    VOLUNTEER = "Volunteer"
    OTHER = "Other"

class ExperienceBase(BaseModel):
    title: str
    organization: str
    role: str
    start_date: str
    end_date: Optional[str] = None
    description: str
    skill_ids: List[str] = []
    achievement_ids: List[str] = []
    type: ExperienceType = ExperienceType.OTHER

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    skill_ids: Optional[List[str]] = None
    achievement_ids: Optional[List[str]] = None
    type: Optional[ExperienceType] = None

class ExperienceResponse(ExperienceBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
