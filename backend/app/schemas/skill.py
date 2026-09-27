from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    icon: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None

class SkillResponse(SkillBase):
    id: str
    created_at: Optional[datetime] = None
    ccs: Optional[int] = 0
    evidence_breadth_gap: Optional[bool] = False
    unanchored: Optional[bool] = False
    evidence_breakdown: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
