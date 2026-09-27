# Shyamarks — Personal Achievement & Evidence Portfolio

**Shyamarks** is a personal achievement, credential, and professional evidence management platform. Built as a single-user portfolio system for recording credentials, certifications, hackathons, open-source projects, and verifying skill mastery with a Claim Confidence Score (CCS) engine.

---

## Brand Tagline
> **Shyamarks — Mark Every Milestone.**
> *Your achievements. Your evidence. Your journey.*

---

## Stack

### Backend
- Python 3.10+ / 3.13, FastAPI, Pydantic v2
- PyMongo (MongoDB Atlas / local MongoDB)
- JWT authentication (`python-jose` + `passlib[bcrypt]`)
- File upload service (Cloudinary with local static fallback)
- `python-dotenv` for configuration

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS (Dark Mode Design System)
- React Router v6
- TanStack Query v5 (`@tanstack/react-query`)
- `qrcode.react` (QR verification generation)
- Lucide React icons

---

## Project Structure

```text
shyamarks/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/           # Config, database setup, JWT security
│   │   ├── models/         # Entity models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business & CRUD services (CCS, uploads)
│   │   ├── routes/         # FastAPI endpoint routers (/api/v1)
│   │   └── utils/          # Slug, CCS computation, validators
│   ├── scripts/
│   │   └── seed_admin.py   # Admin seeder script
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/     # UI, TimelineHeatmap, Lightbox, Cards
    │   ├── pages/          # Public & Admin pages
    │   ├── services/       # API fetch layer
    │   ├── context/        # AuthContext
    │   ├── types/          # TypeScript definitions
    │   ├── layouts/        # PublicLayout & AdminLayout
    │   └── App.tsx
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── index.html
```

---

## Quick Start & Setup Instructions

### 1. Backend Setup

```bash
cd shyamarks/backend

# Create virtual environment (optional)
python -m venv venv
# Activate virtualenv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

Edit `shyamarks/backend/.env` to configure your `MONGODB_URI` (MongoDB Atlas URI or local `mongodb://localhost:27017`).

### 2. Seed Admin User

```bash
# Seed the initial admin account
python scripts/seed_admin.py --email shyam@shyamarks.dev --password "YourStrongPassword"
```

### 3. Run Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```
- API Documentation: `http://localhost:8000/docs`

---

### 4. Frontend Setup

```bash
cd shyamarks/frontend

# Install dependencies
npm install

# Copy frontend env template
cp .env.example .env
```

### 5. Run Frontend Development Server

```bash
npm run dev
```
- Public Portfolio App: `http://localhost:5173`
- Admin Portal: `http://localhost:5173/admin/login`

---

## Claim Confidence Score (CCS) Engine

The **Claim Confidence Score (CCS 0–100)** is calculated dynamically per skill at read-time based on evidence breadth and recency:

- **Evidence Type Weights**:
  - Certification: +30 pts
  - Internship: +25 pts
  - Project: +20 pts
  - Virtual Experience: +15 pts
  - Award: +15 pts
  - Workshop: +10 pts
  - Course: +10 pts
- **Breadth Bonus**: +10 pts for 3+ distinct evidence types, +20 pts for 5+ distinct types.
- **Recency Bonus**: +15 pts if evidence recorded in the last 6 months, +10 pts if in the last 12 months.
- **Derived Flags**:
  - `evidence_breadth_gap`: True if 3+ certifications exist with 0 project implementations.
  - `unanchored`: True if claimed in projects but lacks formal certifications or experience roles.

---

## Visibility System

| State    | Public Explorer | Direct Slug URL | Admin Dashboard |
|----------|-----------------|-----------------|-----------------|
| `public`   | ✅ Listed       | ✅ Accessible   | ✅ Full Access  |
| `unlisted` | ❌ Excluded     | ✅ Accessible   | ✅ Full Access  |
| `private`  | ❌ Excluded     | ❌ Restricted   | ✅ Full Access  |
