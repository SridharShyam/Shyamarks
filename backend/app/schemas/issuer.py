from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IssuerBase(BaseModel):
    name: str
    website: Optional[str] = None
    logo_url: Optional[str] = None

class IssuerCreate(IssuerBase):
    pass

class IssuerUpdate(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None

class IssuerResponse(IssuerBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
