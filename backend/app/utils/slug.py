import re
import unicodedata
from typing import Optional
from bson import ObjectId

def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

async def generate_unique_slug(
    db,
    collection: str,
    base_text: str,
    exclude_id: Optional[str] = None
) -> str:
    base = slugify(base_text)
    slug = base
    counter = 2

    while True:
        query = {"slug": slug}
        if exclude_id:
            try:
                query["_id"] = {"$ne": ObjectId(exclude_id)}
            except Exception:
                query["_id"] = {"$ne": exclude_id}

        existing = await db[collection].find_one(query)
        if not existing:
            return slug
        slug = f"{base}-{counter}"
        counter += 1

