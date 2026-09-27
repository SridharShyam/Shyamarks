# Shyamarks Backend

FastAPI + MongoDB Atlas backend service for Shyamarks — Personal achievement, credential, and professional evidence management platform.

## Setup & Running

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in your connection details:
```bash
cp .env.example .env
```

3. Seed the admin user:
```bash
python scripts/seed_admin.py --email shyam@shyamarks.dev --password "YourStrongPassword"
```

4. Run dev server:
```bash
uvicorn app.main:app --reload --port 8000
```
API Documentation: http://localhost:8000/docs
