import React from 'react';
import { Layers, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Skill } from '../../types';

interface SkillCardProps {
  skill: Skill;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const ccs = skill.ccs ?? 0;
  const breakdown = skill.evidence_breakdown || { certifications: 0, projects: 0, experiences: 0, total: 0 };

  const getCcsColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400 text-emerald-400';
    if (score >= 50) return 'from-brand-500 to-brand-400 text-brand-400';
    if (score >= 30) return 'from-amber-500 to-amber-400 text-amber-400';
    return 'from-slate-500 to-slate-400 text-slate-400';
  };

  return (
    <div className="bg-surface-800/70 border border-surface-700/80 hover:border-brand-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-md">
              {skill.category}
            </span>
            <h4 className="text-base font-bold text-slate-100 mt-1">{skill.name}</h4>
          </div>

          {/* CCS Score Badge */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-mono text-slate-400">CCS Score</span>
            <span className={`text-xl font-black font-mono ${getCcsColor(ccs).split(' ').pop()}`}>
              {ccs}<span className="text-xs text-slate-500 font-normal">/100</span>
            </span>
          </div>
        </div>

        {/* Description */}
        {skill.description && (
          <p className="text-xs text-slate-300/80 mb-4 line-clamp-2">{skill.description}</p>
        )}

        {/* CCS Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-2.5 bg-surface-900 rounded-full overflow-hidden p-0.5 border border-surface-700/50">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getCcsColor(ccs).split(' ').slice(0, 2).join(' ')} transition-all duration-500`}
              style={{ width: `${Math.max(4, ccs)}%` }}
            ></div>
          </div>
        </div>

        {/* Evidence Breakdown Pills */}
        <div className="flex items-center gap-2 flex-wrap mb-3 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-surface-900 border border-surface-700 text-slate-300">
            <strong className="text-brand-300">{breakdown.certifications}</strong> certs
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-900 border border-surface-700 text-slate-300">
            <strong className="text-brand-300">{breakdown.projects}</strong> projects
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-900 border border-surface-700 text-slate-300">
            <strong className="text-brand-300">{breakdown.experiences}</strong> exps
          </span>
        </div>

        {/* Indicators for Derived Flags */}
        <div className="space-y-1.5">
          {skill.evidence_breadth_gap && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>No project evidence attached yet</span>
            </div>
          )}
          {skill.unanchored && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Claimed in project but unverified</span>
            </div>
          )}
          {!skill.evidence_breadth_gap && !skill.unanchored && ccs >= 60 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Strong verified evidence anchor</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
