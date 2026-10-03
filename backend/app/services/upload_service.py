import os
import uuid
import magic
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/webp", "application/pdf"
}
MIME_TO_EXTENSION = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

LOCAL_UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
os.makedirs(LOCAL_UPLOADS_DIR, exist_ok=True)

async def upload_file(file: UploadFile) -> dict:
    # 1. Read entire file into memory
    contents = await file.read()
    file_size = len(contents)

    # 2. Validate size
    if file_size > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum limit of 10MB ({file_size} bytes provided)."
        )

    # 3. Detect TRUE MIME type from file bytes (not header)
    try:
        detected_mime = magic.from_buffer(contents[:2048], mime=True)
    except Exception:
        detected_mime = file.content_type

    if detected_mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"File type '{detected_mime}' is not allowed. Allowed types: PDF, PNG, JPG, JPEG, WEBP."
        )

    ext = MIME_TO_EXTENSION.get(detected_mime, ".bin")
    is_pdf = detected_mime == "application/pdf"
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
        "filename": unique_filename,
        "file_url": file_url,
        "file_type": file_type,
        "file_size": file_size,
        "preview_image_url": preview_image_url
    }

def list_uploads() -> list:
    items = []
    if not os.path.exists(LOCAL_UPLOADS_DIR):
        return items

    for filename in os.listdir(LOCAL_UPLOADS_DIR):
        filepath = os.path.join(LOCAL_UPLOADS_DIR, filename)
        if os.path.isfile(filepath):
            stat = os.stat(filepath)
            ext = os.path.splitext(filename)[1].lower()
            is_pdf = ext == ".pdf"
            file_type = "pdf" if is_pdf else "image"
            file_url = f"/static/uploads/{filename}"
            items.append({
                "filename": filename,
                "file_url": file_url,
                "file_type": file_type,
                "file_size": stat.st_size,
                "created_at": stat.st_ctime,
                "preview_image_url": file_url if not is_pdf else None
            })
    # Sort newest first
    items.sort(key=lambda x: x["created_at"], reverse=True)
    return items

def delete_upload(filename: str) -> bool:
    # Protect against path traversal
    safe_filename = os.path.basename(filename)
    filepath = os.path.join(LOCAL_UPLOADS_DIR, safe_filename)
    if os.path.exists(filepath) and os.path.isfile(filepath):
        os.remove(filepath)
        return True
    return False
