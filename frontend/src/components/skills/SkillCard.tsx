import React from 'react';
import { motion } from 'framer-motion';
import { Layers, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Skill } from '../../types';

interface SkillCardProps {
  skill: Skill;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const ccs = skill.ccs ?? 0;
  const breakdown = skill.evidence_breakdown || { certifications: 0, projects: 0, experiences: 0, total: 0 };

  const getCcsColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 via-teal-400 to-cyan-400 text-emerald-400';
    if (score >= 50) return 'from-brand-500 via-cyanGlow-400 to-blue-400 text-brand-400';
    if (score >= 30) return 'from-amber-500 via-yellow-400 to-orange-400 text-amber-400';
    return 'from-slate-500 to-slate-400 text-slate-400';
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card-hover rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden border border-obsidian-750 light:border-slate-200"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-semibold text-brand-300 font-mono uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full">
              {skill.category}
            </span>
            <h4 className="text-lg font-extrabold text-slate-100 light:text-slate-900 mt-1.5">{skill.name}</h4>
          </div>

          {/* CCS Score Badge */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-mono text-slate-400">CCS Rating</span>
            <span className={`text-2xl font-black font-mono ${getCcsColor(ccs).split(' ').pop()}`}>
              {ccs}<span className="text-xs text-slate-500 font-normal">/100</span>
            </span>
          </div>
        </div>

        {/* Description */}
        {skill.description && (
          <p className="text-xs text-slate-300/80 light:text-slate-600 mb-4 line-clamp-2 leading-relaxed">{skill.description}</p>
        )}

        {/* CCS Animated Progress Bar */}
        <div className="mb-5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Evidence Level</span>
            <span className="font-bold text-slate-200">{ccs}% Mastery</span>
          </div>
          <div className="w-full h-3 bg-obsidian-950 light:bg-slate-200 rounded-full overflow-hidden p-0.5 border border-obsidian-750/70 light:border-slate-300">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(5, ccs)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${getCcsColor(ccs).split(' ').slice(0, 3).join(' ')} shadow-glow-cyan`}
            ></motion.div>
          </div>
        </div>

        {/* Evidence Breakdown Pills */}
        <div className="flex items-center gap-2 flex-wrap mb-4 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-obsidian-900 light:bg-slate-100 border border-obsidian-750 light:border-slate-300 text-slate-300 light:text-slate-700">
            <strong className="text-brand-400">{breakdown.certifications}</strong> certs
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-obsidian-900 light:bg-slate-100 border border-obsidian-750 light:border-slate-300 text-slate-300 light:text-slate-700">
            <strong className="text-brand-400">{breakdown.projects}</strong> projects
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-obsidian-900 light:bg-slate-100 border border-obsidian-750 light:border-slate-300 text-slate-300 light:text-slate-700">
            <strong className="text-brand-400">{breakdown.experiences}</strong> exps
          </span>
        </div>

        {/* Indicators for Derived Flags */}
        <div className="space-y-1.5">
          {skill.evidence_breadth_gap && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>No project evidence attached yet</span>
            </div>
          )}
          {skill.unanchored && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-medium">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Claimed in project but unverified</span>
            </div>
          )}
          {!skill.evidence_breadth_gap && !skill.unanchored && ccs >= 60 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Strong verified evidence anchor</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
