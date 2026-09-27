from pymongo import MongoClient, ASCENDING, DESCENDING
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: MongoClient = None
    db = None

    def connect(self):
        try:
            self.client = MongoClient(settings.MONGODB_URI)
            self.db = self.client[settings.DATABASE_NAME]
            # Ping to confirm connection
            self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB Atlas / Local MongoDB.")
            self.create_indexes()
        except Exception as e:
            logger.warning(f"Could not connect to MongoDB: {e}. Ensure MONGODB_URI is reachable.")

    def create_indexes(self):
        if self.db is None:
            return

        try:
            # achievements indexes
            self.db.achievements.create_index([("slug", ASCENDING)], unique=True)
            self.db.achievements.create_index([("type", ASCENDING)])
            self.db.achievements.create_index([("visibility", ASCENDING)])
            self.db.achievements.create_index([("featured", ASCENDING)])
            self.db.achievements.create_index([("issued_date", DESCENDING)])
            self.db.achievements.create_index([("skill_ids", ASCENDING)])
            self.db.achievements.create_index([("issuer_id", ASCENDING)])

            # skills index
            self.db.skills.create_index([("name", ASCENDING)], unique=True)

            # projects index
            self.db.projects.create_index([("slug", ASCENDING)], unique=True)

            logger.info("MongoDB indexes created successfully.")
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")

    def close(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

db_manager = DatabaseManager()

def get_db():
    if db_manager.db is None:
        db_manager.connect()
    return db_manager.db
