from datetime import datetime, timedelta
from collections import defaultdict
import uuid
from typing import List, Dict, Any

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x

    def union(self, x: int, y: int):
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1

def infer_learning_paths(achievements: List[Dict[str, Any]], skills: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not achievements:
        return []

    n = len(achievements)
    uf = UnionFind(n)

    # Build skill -> achievement indices
    skill_to_indices = defaultdict(list)
    for i, ach in enumerate(achievements):
        for sid in ach.get("skill_ids", []):
            skill_to_indices[str(sid)].append(i)

    def parse_date(d):
        if not d:
            return datetime(2000, 1, 1)
        if isinstance(d, str):
            try:
                return datetime.strptime(d[:10], "%Y-%m-%d")
            except Exception:
                return datetime(2000, 1, 1)
        return datetime(d.year, d.month, d.day)

    dates = [parse_date(a.get("issued_date", "2000-01-01")) for a in achievements]

    # Count shared skills between achievement pairs within 540 days
    shared_count = defaultdict(int)
    for sid, indices in skill_to_indices.items():
        for i in range(len(indices)):
            for j in range(i + 1, len(indices)):
                a, b = indices[i], indices[j]
                if abs((dates[a] - dates[b]).days) <= 540:
                    key = (min(a, b), max(a, b))
                    shared_count[key] += 1

    for (a, b), count in shared_count.items():
        if count >= 2:
            uf.union(a, b)

    # Group into components
    components = defaultdict(list)
    for i in range(n):
        components[uf.find(i)].append(i)

    # Build paths from components with >= 2 achievements
    skill_map = {str(s.get("id", s.get("_id"))): s for s in skills}
    paths = []

    for root, indices in components.items():
        if len(indices) < 2:
            continue

        component_achs = [achievements[i] for i in indices]
        component_achs.sort(key=lambda a: parse_date(a.get("issued_date", "2000-01-01")))

        # Find dominant skill category
        category_count = defaultdict(int)
        skill_name_count = defaultdict(int)
        for ach in component_achs:
            for sid in ach.get("skill_ids", []):
                s = skill_map.get(str(sid))
                if s:
                    cat = s.get("category", "General")
                    category_count[cat] += 1
                    skill_name_count[s.get("name", "")] += 1

        top_category = max(category_count, key=category_count.get) if category_count else "General"
        top_skills = sorted(skill_name_count, key=skill_name_count.get, reverse=True)[:2]

        start_date = parse_date(component_achs[0].get("issued_date", "2000-01-01"))
        end_date = parse_date(component_achs[-1].get("issued_date", "2000-01-01"))

        description = (
            f"{len(component_achs)} milestones from {start_date.year}"
            + (f" to {end_date.year}" if end_date.year != start_date.year else "")
            + (f", anchored in {' and '.join(top_skills)}" if top_skills else "")
        )

        paths.append({
            "id": str(uuid.uuid4()),
            "name": f"{top_category} Track",
            "milestone_count": len(component_achs),
            "achievements": component_achs,
            "primary_skill_ids": list(skill_name_count.keys())[:3],
            "date_range": {
                "start": start_date.strftime("%Y-%m-%d"),
                "end": end_date.strftime("%Y-%m-%d"),
            },
            "description": description,
        })

    # Sort by milestone count descending, return top 6
    paths.sort(key=lambda p: p["milestone_count"], reverse=True)
    return paths[:6]
