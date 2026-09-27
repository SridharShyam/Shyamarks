from datetime import datetime
from typing import List, Dict, Any, Set
from collections import defaultdict

def parse_date(date_str: str):
    if not date_str:
        return None
    try:
        return datetime.strptime(str(date_str).split('T')[0], "%Y-%m-%d").date()
    except Exception:
        return None

def infer_learning_paths(achievements: List[Dict[str, Any]], skills: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # Create skill lookup
    skill_map = {s["id"]: s for s in skills}
    
    # Filter valid achievements with dates
    valid_achs = []
    for a in achievements:
        d = parse_date(a.get("issued_date"))
        if d:
            valid_achs.append({
                "doc": a,
                "date": d,
                "skill_ids": set(a.get("skill_ids", []))
            })

    if len(valid_achs) < 2:
        return []

    n = len(valid_achs)
    adj = defaultdict(list)

    # Build graph edges: share 2+ skills AND within 540 days
    for i in range(n):
        for j in range(i + 1, n):
            shared_skills = valid_achs[i]["skill_ids"].intersection(valid_achs[j]["skill_ids"])
            days_diff = abs((valid_achs[i]["date"] - valid_achs[j]["date"]).days)
            
            # Allow edge if 2+ shared skills or if 1 shared skill with <= 180 days gap
            if (len(shared_skills) >= 2 and days_diff <= 540) or (len(shared_skills) >= 1 and days_diff <= 180):
                adj[i].append(j)
                adj[j].append(i)

    # Connected components using BFS
    visited = set()
    components = []

    for i in range(n):
        if i not in visited:
            comp = []
            queue = [i]
            visited.add(i)
            while queue:
                curr = queue.pop(0)
                comp.append(curr)
                for neighbor in adj[curr]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            if len(comp) >= 2:
                components.append(comp)

    paths = []
    path_counter = 1

    for comp in components:
        comp_achs = [valid_achs[idx] for idx in comp]
        comp_achs.sort(key=lambda x: x["date"])

        # Aggregate categories and skill counts
        category_counts = defaultdict(int)
        skill_counts = defaultdict(int)
        all_skills = set()

        for item in comp_achs:
            for sid in item["skill_ids"]:
                all_skills.add(sid)
                skill_counts[sid] += 1
                sk = skill_map.get(sid)
                if sk and sk.get("category"):
                    category_counts[sk["category"]] += 1

        top_category = "Specialized"
        if category_counts:
            top_category = max(category_counts.items(), key=lambda x: x[1])[0]

        top_skills = sorted(list(all_skills), key=lambda sid: skill_counts[sid], reverse=True)
        top_skill_names = [skill_map[sid]["name"] for sid in top_skills if sid in skill_map]

        start_date = comp_achs[0]["date"]
        end_date = comp_achs[-1]["date"]

        anchors_str = ", ".join(top_skill_names[:2]) if top_skill_names else "core competencies"
        description = (
            f"{len(comp_achs)} milestones from {start_date.year} to {end_date.year}, "
            f"anchored in {anchors_str}"
        )

        path_id = f"path-{path_counter}"
        path_counter += 1

        paths.append({
            "id": path_id,
            "name": f"{top_category} Track",
            "milestone_count": len(comp_achs),
            "achievements": [item["doc"] for item in comp_achs],
            "primary_skill_ids": top_skills[:5],
            "primary_skill_names": top_skill_names[:5],
            "date_range": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "description": description
        })

    paths.sort(key=lambda p: p["milestone_count"], reverse=True)
    return paths[:6]
