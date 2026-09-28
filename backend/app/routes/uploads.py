from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.services.upload_service import upload_file, list_uploads, delete_upload
from app.core.security import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])

@router.post("")
async def upload_file_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    result = await upload_file(file)
    return result

@router.get("")
def get_uploads_endpoint(
    current_user: dict = Depends(get_current_user)
):
    return list_uploads()

@router.delete("/{filename}", status_code=status.HTTP_204_NO_CONTENT)
def delete_upload_endpoint(
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    success = delete_upload(filename)
    if not success:
        raise HTTPException(status_code=404, detail="Upload file not found")
    return None
