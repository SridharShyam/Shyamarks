import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import db_manager
from app.routes import (
    auth, achievements, skills, projects, experiences, issuers, uploads, verify, learning_paths, share_packs
)

import json
from typing import Any
from bson import ObjectId
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

class BSONJSONResponse(JSONResponse):
    def render(self, content: Any) -> bytes:
        return json.dumps(
            content,
            default=lambda o: str(o) if isinstance(o, ObjectId) else TypeError(repr(o))
        ).encode()

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    db_manager.connect()
    yield
    # Shutdown actions
    db_manager.close()

app = FastAPI(
    title="Shyamarks API",
    description="Personal achievement, credential, and professional evidence management platform API.",
    version="1.0.0",
    default_response_class=BSONJSONResponse,
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Restricted to authorized domains from env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory for local upload fallback
static_uploads_path = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_uploads_path, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_uploads_path), name="static")

# Register routers under /api/v1
api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(achievements.router, prefix=api_prefix)
app.include_router(skills.router, prefix=api_prefix)
app.include_router(projects.router, prefix=api_prefix)
app.include_router(experiences.router, prefix=api_prefix)
app.include_router(issuers.router, prefix=api_prefix)
app.include_router(uploads.router, prefix=api_prefix)
app.include_router(verify.router, prefix=api_prefix)
app.include_router(learning_paths.router, prefix=api_prefix)
app.include_router(share_packs.router, prefix=api_prefix)

@app.get("/")
def root():
    return {
        "name": "Shyamarks API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }
