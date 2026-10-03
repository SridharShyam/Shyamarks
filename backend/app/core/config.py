import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "shyamarks"
    
    JWT_SECRET: str = "super-secret-key-change-this-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    FRONTEND_URL: str = "http://localhost:5173"

    # CCS (Competency Confidence Score) Formulas & Weights
    CCS_EVIDENCE_WEIGHTS: str = '{"Certification":30,"Internship":25,"Virtual Experience":15,"Workshop":10,"Course":10,"Project":20,"Award":15,"Hackathon":12,"Competition":12,"Training":10,"Publication":20,"Other":5}'
    CCS_BREADTH_BONUS_TIER1: int = 20
    CCS_BREADTH_BONUS_TIER2: int = 10
    CCS_RECENCY_BONUS_TIER1: int = 15
    CCS_RECENCY_BONUS_TIER2: int = 10
    CCS_VELOCITY_ACCELERATING_DAYS: int = 180
    CCS_VELOCITY_STABLE_DAYS: int = 540

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
