"""
Sitemap Generator Script for Shyamarks
Run: python scripts/generate_sitemap.py --api-url http://localhost:8000
"""
import argparse
import os
import requests
from datetime import datetime

def generate_sitemap(api_url: str, base_url: str = "https://shyamarks.vercel.app"):
    routes = [
        "",
        "/achievements",
        "/skills",
        "/projects",
        "/timeline",
        "/learning-paths"
    ]
    
    # Fetch public achievements
    try:
        res = requests.get(f"{api_url}/api/v1/achievements?limit=1000")
        if res.status_code == 200:
            data = res.json()
            items = data.get("items", [])
            for item in items:
                if item.get("slug"):
                    routes.append(f"/achievements/{item['slug']}")
    except Exception as e:
        print(f"Warning: Could not fetch achievements from API: {e}")

    # Fetch projects
    try:
        res = requests.get(f"{api_url}/api/v1/projects")
        if res.status_code == 200:
            items = res.json()
            for item in items:
                if item.get("slug"):
                    routes.append(f"/projects/{item['slug']}")
    except Exception as e:
        print(f"Warning: Could not fetch projects from API: {e}")

    now = datetime.utcnow().strftime("%Y-%m-%d")
    
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    
    for route in routes:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{base_url}{route}</loc>")
        xml_lines.append(f"    <lastmod>{now}</lastmod>")
        xml_lines.append("    <changefreq>weekly</changefreq>")
        xml_lines.append("    <priority>1.0</priority>" if route == "" else "    <priority>0.8</priority>")
        xml_lines.append("  </url>")
        
    xml_lines.append("</urlset>")
    
    sitemap_content = "\n".join(xml_lines)
    
    out_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "public")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "sitemap.xml")
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(sitemap_content)
        
    print(f"Sitemap successfully written to {out_path} with {len(routes)} URLs.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate sitemap.xml for Shyamarks")
    parser.add_argument("--api-url", default="http://localhost:8000", help="Base URL of backend API")
    args = parser.parse_args()
    generate_sitemap(args.api_url)
