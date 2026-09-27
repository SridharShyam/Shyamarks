from datetime import date, datetime, timezone, timedelta
from typing import List, Dict, Any

EVIDENCE_WEIGHTS = {
    "Certification": 30,
    "Internship": 25,
    "Virtual Experience": 15,
    "Workshop": 10,
    "Course": 10,
    "Project": 20,
    "Award": 15,
    "Hackathon": 12,
    "Competition": 12,
    "Training": 10,
    "Publication": 20,
    "Other": 5,
}

def compute_ccs(achievements: List[Dict[str, Any]]) -> dict:
    """
    achievements: list of achievement dicts linked to a skill
    Returns: {
        score: int (0-100),
        evidence_types: list of unique types,
        breadth_gap: bool,
        unanchored: bool,
        breakdown: dict of type->count
    }
    """
    if not achievements:
        return {
            "score": 0,
            "evidence_types": [],
            "breadth_gap": False,
            "unanchored": True,
            "breakdown": {}
        }

    seen_types = set()
    breakdown = {}
    base_score = 0
    today = date.today()
    most_recent_date = None

    for ach in achievements:
        ach_type = ach.get("type", "Other")
        ach_date = ach.get("issued_date")

        # Track breakdown
        breakdown[ach_type] = breakdown.get(ach_type, 0) + 1

        # Add weight only once per type (breadth model, not volume model)
        if ach_type not in seen_types:
            base_score += EVIDENCE_WEIGHTS.get(ach_type, 5)
            seen_types.add(ach_type)

        # Track most recent evidence date
        if ach_date:
            if isinstance(ach_date, str):
                try:
                    ach_date = datetime.strptime(ach_date.split('T')[0], "%Y-%m-%d").date()
                except Exception:
                    ach_date = None
            elif isinstance(ach_date, datetime):
                ach_date = ach_date.date()
            if ach_date:
                if most_recent_date is None or ach_date > most_recent_date:
                    most_recent_date = ach_date

    # Breadth bonus
    breadth_bonus = 0
    if len(seen_types) >= 5:
        breadth_bonus = 20
    elif len(seen_types) >= 3:
        breadth_bonus = 10

    # Recency bonus
    recency_bonus = 0
    if most_recent_date:
        days_since = (today - most_recent_date).days
        if days_since <= 180:
            recency_bonus = 15
        elif days_since <= 365:
            recency_bonus = 10

    raw_score = base_score + breadth_bonus + recency_bonus
    final_score = min(raw_score, 100)

    # Derived flags
    has_cert = any(t in seen_types for t in ["Certification", "Course", "Workshop", "Training"])
    has_project = "Project" in seen_types
    has_experience = any(t in seen_types for t in ["Internship", "Virtual Experience"])

    breadth_gap = has_cert and not has_project
    unanchored = not has_cert and not has_experience

    return {
        "score": final_score,
        "evidence_types": list(seen_types),
        "breadth_gap": breadth_gap,
        "unanchored": unanchored,
        "breakdown": breakdown
    }

def calculate_ccs_for_skill(
    skill_id: str,
    achievements: List[Dict[str, Any]],
    projects: List[Dict[str, Any]] = None,
    experiences: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    related_ach = [a for a in achievements if skill_id in a.get("skill_ids", []) or str(skill_id) in [str(s) for s in a.get("skill_ids", [])]]
    if projects:
        for p in projects:
            if skill_id in p.get("skill_ids", []) or str(skill_id) in [str(s) for s in p.get("skill_ids", [])]:
                related_ach.append({"type": "Project", "issued_date": p.get("created_at") or p.get("start_date")})

    ccs_result = compute_ccs(related_ach)
    return {
        "ccs": ccs_result["score"],
        "evidence_breadth_gap": ccs_result["breadth_gap"],
        "unanchored": ccs_result["unanchored"],
        "evidence_breakdown": ccs_result["breakdown"]
    }
