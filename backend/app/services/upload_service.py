import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

LOCAL_UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
os.makedirs(LOCAL_UPLOADS_DIR, exist_ok=True)

async def upload_file(file: UploadFile) -> dict:
    content_type = file.content_type
    
    # 1. Validate content type against ALLOWED_TYPES
    if content_type not in ALLOWED_TYPES:
        filename_ext = file.filename.split('.')[-1].lower() if file.filename and '.' in file.filename else ''
        if filename_ext in ['jpg', 'jpeg']:
            content_type = "image/jpeg"
        elif filename_ext == 'png':
            content_type = "image/png"
        elif filename_ext == 'webp':
            content_type = "image/webp"
        elif filename_ext == 'pdf':
            content_type = "application/pdf"
        else:
            raise HTTPException(
                status_code=422,
                detail=f"Unsupported file type '{content_type}'. Allowed types: PDF, PNG, JPG, JPEG, WEBP."
            )

    # 2. Read file into memory, validate actual size
    contents = await file.read()
    file_size = len(contents)
    if file_size > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=422,
            detail=f"File size exceeds maximum limit of 10MB ({file_size} bytes provided)."
        )

    ext = ALLOWED_TYPES.get(content_type, ".bin")
    is_pdf = content_type == "application/pdf"
    file_type = "pdf" if is_pdf else "image"

    # 4. Generate a unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"

    # 5. Upload to Cloudinary if configured
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        try:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET
            )
            result = cloudinary.uploader.upload(contents, resource_type="auto")
            file_url = result.get("secure_url")
            
            preview_image_url = None
            if is_pdf and file_url:
                preview_image_url = file_url.replace("/upload/", "/upload/f_jpg,pg_1,w_800/")
            elif not is_pdf:
                preview_image_url = file_url

            return {
                "file_url": file_url,
                "file_type": file_type,
                "file_size": file_size,
                "preview_image_url": preview_image_url
            }
        except Exception as e:
            # On Cloudinary failure when configured, raise HTTP 502
            raise HTTPException(status_code=502, detail="Storage service unavailable")

    # Local storage fallback when Cloudinary credentials are empty
    target_path = os.path.join(LOCAL_UPLOADS_DIR, unique_filename)
    with open(target_path, "wb") as f:
        f.write(contents)

    file_url = f"/static/uploads/{unique_filename}"
    preview_image_url = file_url if not is_pdf else None

    return {
        "file_url": file_url,
        "file_type": file_type,
        "file_size": file_size,
        "preview_image_url": preview_image_url
    }
