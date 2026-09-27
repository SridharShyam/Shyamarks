import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_MIME_TYPES = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp"
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Create local uploads folder as fallback
LOCAL_UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
os.makedirs(LOCAL_UPLOADS_DIR, exist_ok=True)

async def upload_file(file: UploadFile) -> dict:
    content_type = file.content_type
    if content_type not in ALLOWED_MIME_TYPES:
        # Also check extension if MIME is generic
        filename_ext = file.filename.split('.')[-1].lower() if file.filename and '.' in file.filename else ''
        if filename_ext not in ['pdf', 'png', 'jpg', 'jpeg', 'webp']:
            raise HTTPException(
                status_code=422,
                detail=f"Unsupported file type '{content_type}'. Allowed types: PDF, PNG, JPG, JPEG, WEBP."
            )

    contents = await file.read()
    file_size = len(contents)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=422,
            detail=f"File size exceeds maximum limit of 10MB ({file_size} bytes provided)."
        )

    ext = ALLOWED_MIME_TYPES.get(content_type, file.filename.split('.')[-1].lower() if '.' in file.filename else 'bin')
    is_image = ext in ['png', 'jpg', 'jpeg', 'webp']

    # Use Cloudinary if credentials are configured
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        try:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET
            )
            resource_type = "image" if is_image else "raw"
            result = cloudinary.uploader.upload(contents, resource_type=resource_type)
            file_url = result.get("secure_url")
            preview_url = file_url if is_image else None
            return {
                "file_url": file_url,
                "file_type": ext,
                "file_size": file_size,
                "preview_url": preview_url
            }
        except Exception as e:
            # Fall back to local storage if Cloudinary fails
            pass

    # Local file storage fallback
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    target_path = os.path.join(LOCAL_UPLOADS_DIR, unique_filename)
    with open(target_path, "wb") as f:
        f.write(contents)

    file_url = f"/static/uploads/{unique_filename}"
    preview_url = file_url if is_image else None

    return {
        "file_url": file_url,
        "file_type": ext,
        "file_size": file_size,
        "preview_url": preview_url
    }
