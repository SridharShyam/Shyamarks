# Shyamarks

**Mark Every Milestone.**

*Your achievements. Your evidence. Your journey.*

---

## What is Shyamarks?

Shyamarks is my personal achievement and credential portfolio - a structured record of every certification, internship, virtual experience, workshop, project, and milestone from my learning journey as a B.Tech AI & ML student.

It is not a certificate gallery.

Most portfolio platforms let you list what you know. Shyamarks asks you to prove it. Every skill I claim here is backed by formal evidence - certifications, completed projects, internship experience, or workshop attendance. The system makes that evidence chain visible and auditable.

> **Don't just claim what you know. Show the evidence behind it.**

---

## What You Can Explore

- **[Achievements →](https://shyamarks.vercel.app/achievements)**
  Browse every certification, internship, virtual experience, hackathon, and award - searchable, filterable, and individually detailed.

- **[Skills →](https://shyamarks.vercel.app/skills)**
  See every skill I claim, how confident that claim is (scored 0–100), how current the evidence is, and exactly what backs it up.

- **[Projects →](https://shyamarks.vercel.app/projects)**
  Projects linked directly to the skills and certifications that made them possible.

- **[Learning Paths →](https://shyamarks.vercel.app/learning-paths)**
  Trajectories inferred automatically from my achievement history - the tracks I've walked without necessarily naming them.

- **[Timeline →](https://shyamarks.vercel.app/timeline)**
  A chronological and density view of when growth happened, not just what happened.

---

## The Story Behind This

I built Shyamarks because I kept running into the same problem: I had earned certifications, completed internships, and built projects - but they lived in scattered folders, platform profiles, and email attachments. None of it told a coherent story.

Recruiters would see "Python" on a resume. They had no way to know whether that meant one introductory course or five certifications, three projects, and two internships. I wanted a system that answered that question honestly and automatically.

The other motivation was personal: building Shyamarks itself required designing a full-stack system from a domain model through to deployment. It is both the portfolio and a demonstration of what the portfolio represents.

---

## What Makes Shyamarks Different

### Unique Features

**1. Claim Confidence Score (CCS)**
Every skill gets a computed score from 0–100 based on the breadth of evidence types and how recent that evidence is. A Python score of 87 means something specific - it is not an endorsement count or a self-assessment.

**2. Recruiter Share Mode**
Paste a job description. Shyamarks filters the evidence graph for matching achievements and skills and generates a time-limited, role-specific evidence link - shareable without exposing the full portfolio.

**3. Achievement Narrative Layer**
Each achievement optionally carries a structured story: Context (what was happening), Challenge (what made it meaningful), Outcome (what changed). Raw credentials become interview material.

**4. Learning Path Inference Engine**
An algorithm analyses shared skills and time proximity across achievements and infers learning trajectories automatically. Tracks emerge from the data without manual curation.

**5. Verification Fingerprint**
Each achievement carries a SHA-256-derived 12-character fingerprint, computed from its immutable fields. Anyone can visit `/verify/:fingerprint` to confirm the achievement exists and its data has not been altered - no external service required.

### Distinctive Novelties

**1. Evidence Depth vs. Breadth Visualization**
A per-skill chart showing certificate volume against evidence type coverage - spotting quality gaps that count totals hide.

**2. Skill Gap Backfill Detection**
Skills that appear in project descriptions but have zero formal backing surface as "unanchored" - forcing honest accounting of what is claimed versus what is evidenced.

**3. Timeline Density Heatmap**
A GitHub-style monthly activity grid showing *when* professional growth happened - making sustained effort visible in a way a list cannot.

**4. Skill Velocity Indicator**
Each skill shows whether it is Accelerating (evidence in the last 6 months), Stable, or Cooling - distinguishing current skills from historical ones.

**5. Evidence Coverage Matrix**
A skills × evidence-types matrix across the entire portfolio. Every gap is visible at once. One view answers: "where am I building broadly and where am I thin?"

---

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Python 3.11, FastAPI, Pydantic v2, PyMongo |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |
| Auth | JWT (httpOnly cookie), passlib/bcrypt |
| Deployment | Vercel (frontend), Render (backend) |

---

## About

Built by **Shyam** - B.Tech AI & ML, Saveetha Engineering College, Chennai.
Titans Cohort 2026 · QuodeSchool BTG · Chief Advisor, Voice of the Wild

[Portfolio](https://shyam-portfolio-chi.vercel.app) ·
[GitHub](https://github.com/SridharShyam) ·
[LinkedIn](https://linkedin.com/in/sridharshy)

---

*Shyamarks - built to show the evidence, not just the claim.*
