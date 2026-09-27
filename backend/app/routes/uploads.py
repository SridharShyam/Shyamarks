from fastapi import APIRouter, Depends, UploadFile, File
from app.services.upload_service import upload_file
from app.core.security import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])

@router.post("")
async def upload_file_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    result = await upload_file(file)
    return result
