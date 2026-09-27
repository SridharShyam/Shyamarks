import { Achievement, Skill, Project } from '../types';

export function exportEvidenceDossier(
  achievements: Achievement[],
  skills: Skill[],
  projects: Project[]
) {
  const dateStr = new Date().toISOString().substring(0, 10);
  
  let md = `# Shyamarks — Verified Evidence Dossier\n`;
  md += `**Generated Date**: ${dateStr}\n`;
  md += `**Author**: Shyam\n\n`;
  
  md += `## 🏆 Verified Credentials & Achievements (${achievements.length})\n\n`;
  achievements.forEach((ach, i) => {
    md += `### ${i + 1}. ${ach.title}\n`;
    md += `- **Type**: ${ach.type}\n`;
    if (ach.issuer) md += `- **Issuer**: ${ach.issuer.name}\n`;
    md += `- **Issued Date**: ${ach.issued_date}\n`;
    if (ach.credential_id) md += `- **Credential ID**: \`${ach.credential_id}\`\n`;
    if (ach.verification_url) md += `- **Verification URL**: ${ach.verification_url}\n`;
    md += `- **Description**: ${ach.description}\n\n`;
  });

  md += `## ⚡ Skill Confidence Index (CCS)\n\n`;
  md += `| Skill Name | Category | CCS Score (0–100) | Certs | Projects | Experiences |\n`;
  md += `|------------|----------|-------------------|-------|----------|-------------|\n`;
  skills.forEach((s) => {
    const b = s.evidence_breakdown || { certifications: 0, projects: 0, experiences: 0 };
    md += `| ${s.name} | ${s.category} | ${s.ccs || 0}/100 | ${b.certifications} | ${b.projects} | ${b.experiences} |\n`;
  });

  md += `\n## 💻 Projects & Code Evidence (${projects.length})\n\n`;
  projects.forEach((p, i) => {
    md += `### ${i + 1}. ${p.title}\n`;
    md += `${p.description}\n`;
    if (p.github_url) md += `- **GitHub**: ${p.github_url}\n`;
    if (p.live_url) md += `- **Live Demo**: ${p.live_url}\n`;
    if (p.tags.length > 0) md += `- **Tags**: ${p.tags.join(', ')}\n`;
    md += `\n`;
  });

  // Download blob as markdown file
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Shyamarks_Evidence_Dossier_${dateStr}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
