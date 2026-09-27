import sys
import os
import argparse
from datetime import datetime, timezone

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.core.database import db_manager, get_db
from app.core.security import get_password_hash

def seed_admin(email: str, password: str):
    db_manager.connect()
    db = get_db()
    if db is None:
        print("Error: Could not connect to MongoDB. Check MONGODB_URI.")
        sys.exit(1)

    email = email.strip().lower()
    hashed = get_password_hash(password)

    existing_user = db.users.find_one({"email": email})
    if existing_user:
        db.users.update_one(
            {"_id": existing_user["_id"]},
            {"$set": {"hashed_password": hashed, "updated_at": datetime.now(timezone.utc)}}
        )
        print(f"Successfully updated admin password for: {email}")
    else:
        user_doc = {
            "email": email,
            "hashed_password": hashed,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        res = db.users.insert_one(user_doc)
        print(f"Successfully created admin user: {email} (ID: {res.inserted_id})")

    db_manager.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed single-user admin for Shyamarks")
    parser.add_argument("--email", type=str, help="Admin email address", default="shyam@shyamarks.dev")
    parser.add_argument("--password", type=str, help="Admin password", default="Admin@123456")
    args = parser.parse_args()

    seed_admin(args.email, args.password)
