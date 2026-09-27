from datetime import datetime, timezone
from typing import List, Dict, Any

EVIDENCE_WEIGHTS = {
    "Certification": 30,
    "Internship": 25,
    "Virtual Experience": 15,
    "Workshop": 10,
    "Course": 10,
    "Project": 20,
    "Award": 15
}

def calculate_ccs_for_skill(
    skill_id: str,
    achievements: List[Dict[str, Any]],
    projects: List[Dict[str, Any]],
    experiences: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Computes Claim Confidence Score (CCS 0-100) and derived flags for a given skill.
    """
    now = datetime.now(timezone.utc)
    six_months_ago = now - timedelta(days=182)
    twelve_months_ago = now - timedelta(days=365)

    from datetime import timedelta

    # Filter achievements referencing skill_id
    related_achievements = [a for a in achievements if skill_id in a.get("skill_ids", [])]
    
    # Filter projects referencing skill_id
    related_projects = [p for p in projects if skill_id in p.get("skill_ids", [])]

    # Filter experiences referencing skill_id
    related_experiences = [e for e in experiences if skill_id in e.get("skill_ids", [])]

    evidence_types_present = set()
    latest_evidence_date = None

    def update_latest_date(date_val):
        nonlocal latest_evidence_date
        if not date_val:
            return
        if isinstance(date_val, str):
            try:
                date_val = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
            except Exception:
                return
        if date_val.tzinfo is None:
            date_val = date_val.replace(tzinfo=timezone.utc)
        if latest_evidence_date is None or date_val > latest_evidence_date:
            latest_evidence_date = date_val

    cert_count = 0
    award_count = 0
    internship_count = 0
    virtual_exp_count = 0
    workshop_count = 0
    course_count = 0
    other_ach_count = 0

    for ach in related_achievements:
        ach_type = ach.get("type")
        if ach_type:
            evidence_types_present.add(ach_type)
        if ach_type == "Certification":
            cert_count += 1
        elif ach_type == "Award":
            award_count += 1
        elif ach_type == "Internship":
            internship_count += 1
        elif ach_type == "Virtual Experience":
            virtual_exp_count += 1
        elif ach_type == "Workshop":
            workshop_count += 1
        elif ach_type == "Course":
            course_count += 1
        else:
            other_ach_count += 1
        
        update_latest_date(ach.get("issued_date"))

    project_count = len(related_projects)
    if project_count > 0:
        evidence_types_present.add("Project")
        for proj in related_projects:
            update_latest_date(proj.get("created_at"))

    exp_count = len(related_experiences)
    for exp in related_experiences:
        exp_type = exp.get("type")
        if exp_type == "Internship":
            evidence_types_present.add("Internship")
            internship_count += 1
        else:
            evidence_types_present.add("Experience")
        update_latest_date(exp.get("start_date"))

    # Base score: max once per evidence type
    base_score = 0
    for etype in evidence_types_present:
        base_score += EVIDENCE_WEIGHTS.get(etype, 0)

    # Breadth bonus
    distinct_types_count = len(evidence_types_present)
    breadth_bonus = 0
    if distinct_types_count >= 5:
        breadth_bonus = 20
    elif distinct_types_count >= 3:
        breadth_bonus = 10

    # Recency bonus
    recency_bonus = 0
    if latest_evidence_date:
        if latest_evidence_date >= six_months_ago:
            recency_bonus = 15
        elif latest_evidence_date >= twelve_months_ago:
            recency_bonus = 10

    total_ccs = min(100, base_score + breadth_bonus + recency_bonus)

    # Derived flags
    # evidence_breadth_gap: true if 3+ certifications exist but 0 projects for this skill
    evidence_breadth_gap = (cert_count >= 3 and project_count == 0)

    # unanchored: true if the skill appears in a project's skill_ids but has 0 certifications and 0 experiences
    # (experiences including both achievement type Internship/Experience or Experience entity)
    total_certs_and_exps = cert_count + exp_count + internship_count + virtual_exp_count
    unanchored = (project_count > 0 and total_certs_and_exps == 0)

    breakdown = {
        "certifications": cert_count,
        "projects": project_count,
        "experiences": exp_count,
        "internships": internship_count,
        "virtual_experiences": virtual_exp_count,
        "workshops": workshop_count,
        "courses": course_count,
        "awards": award_count,
        "total": len(related_achievements) + project_count + exp_count
    }

    return {
        "ccs": total_ccs,
        "evidence_breadth_gap": evidence_breadth_gap,
        "unanchored": unanchored,
        "evidence_breakdown": breakdown
    }
