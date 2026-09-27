import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EVIDENCE_TYPES = [
  'Certification',
  'Course',
  'Workshop',
  'Training',
  'Project',
  'Internship',
  'Virtual Experience',
  'Hackathon',
  'Competition',
  'Award',
  'Publication',
];

export const EvidenceCoverageMatrix = ({ skills = [], achievements = [] }) => {
  const [hoveredCol, setHoveredCol] = useState(null);

  // Sort skills by CCS score descending
  const sortedSkills = [...skills].sort((a, b) => (b.ccs || 0) - (a.ccs || 0));

  // Build matrix lookup helper
  const getCount = (skill, type) => {
    if (skill.evidence_breakdown && skill.evidence_breakdown[type] !== undefined) {
      return skill.evidence_breakdown[type];
    }
    // Fallback: match from achievements array
    const matched = achievements.filter((a) => {
      const typeMatch = a.type === type;
      const skillMatch = a.skill_ids?.includes(skill.id);
      return typeMatch && skillMatch;
    });
    return matched.length;
  };

  // Compute coverage counts per column
  const columnCoverage = EVIDENCE_TYPES.map((type) => {
    return sortedSkills.filter((s) => getCount(s, type) > 0).length;
  });

  const totalSkillsCount = sortedSkills.length || 1;

  return (
    <div className="space-y-4">
      <div className="bg-surface-800/90 border border-surface-700/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-900/90 border-b border-surface-700 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3.5 sticky left-0 z-20 bg-surface-900 border-r border-surface-700 w-40 min-w-[160px] font-bold text-white">
                  Skill Name
                </th>
                {EVIDENCE_TYPES.map((type, idx) => (
                  <th
                    key={type}
                    onMouseEnter={() => setHoveredCol(idx)}
                    onMouseLeave={() => setHoveredCol(null)}
                    className={`px-3 py-3.5 text-center transition-colors min-w-[90px] ${
                      hoveredCol === idx ? 'bg-surface-700/60 text-white font-bold' : ''
                    }`}
                  >
                    {type}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-center font-bold text-brand-300">CCS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/60 text-slate-200 font-mono">
              {sortedSkills.map((skill) => (
                <tr
                  key={skill.id}
                  className="hover:bg-surface-700/40 transition-colors group"
                >
                  {/* Fixed left skill name cell */}
                  <td className="px-4 py-3 sticky left-0 z-10 bg-surface-800 group-hover:bg-surface-700/80 border-r border-surface-700 font-sans font-bold text-white">
                    <div className="truncate max-w-[150px]">{skill.name}</div>
                    <span className="text-[10px] text-slate-400 font-normal font-mono block">
                      {skill.category}
                    </span>
                  </td>

                  {/* Evidence Matrix Cells */}
                  {EVIDENCE_TYPES.map((type, colIdx) => {
                    const count = getCount(skill, type);
                    const hasEvidence = count > 0;
                    return (
                      <td
                        key={type}
                        onMouseEnter={() => setHoveredCol(colIdx)}
                        onMouseLeave={() => setHoveredCol(null)}
                        className={`px-3 py-3 text-center transition-colors ${
                          hoveredCol === colIdx ? 'bg-surface-700/30' : ''
                        }`}
                        title={
                          hasEvidence
                            ? `${count} ${type} evidence for ${skill.name}`
                            : `No ${type} evidence for ${skill.name}`
                        }
                      >
                        <div className="flex items-center justify-center">
                          {hasEvidence ? (
                            <span className="w-4 h-4 rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 inline-flex items-center justify-center text-[9px] font-bold text-white">
                              ●
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border-2 border-surface-600 inline-block opacity-40">
                              ○
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* CCS Score column */}
                  <td className="px-4 py-3 text-center font-bold text-brand-300">
                    {skill.ccs ?? 0}
                  </td>
                </tr>
              ))}

              {/* Summary Row */}
              <tr className="bg-surface-900/90 font-bold border-t-2 border-surface-700">
                <td className="px-4 py-3.5 sticky left-0 z-10 bg-surface-900 border-r border-surface-700 text-white font-sans">
                  Coverage
                </td>
                {columnCoverage.map((count, colIdx) => {
                  const pct = (count / totalSkillsCount) * 100;
                  const isLow = pct < 25;
                  return (
                    <td
                      key={colIdx}
                      className={`px-3 py-3.5 text-center ${
                        isLow ? 'text-rose-400 font-extrabold' : 'text-emerald-400'
                      }`}
                    >
                      {count}
                    </td>
                  );
                })}
                <td className="px-4 py-3.5 text-center text-slate-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Caption Note */}
      <p className="text-[11px] font-mono text-slate-400 text-center">
        ● = evidence exists &nbsp;·&nbsp; ○ = no evidence &nbsp;·&nbsp; Built from {achievements.length} achievements across {skills.length} skills
      </p>
    </div>
  );
};
