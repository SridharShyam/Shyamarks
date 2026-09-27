import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, HelpCircle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const SkillCard = ({ skill }) => {
  const ccs = skill.ccs ?? 0;
  const breakdown = skill.evidence_breakdown || {};
  const velocity = skill.velocity || 'cooling';

  const velocityConfig = {
    accelerating: {
      label: 'Accelerating',
      icon: TrendingUp,
      style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      tooltip: skill.last_evidence_date
        ? `Evidence added within last 6 months (${skill.last_evidence_date})`
        : 'Evidence added within last 6 months',
    },
    stable: {
      label: 'Stable',
      icon: Minus,
      style: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      tooltip: skill.last_evidence_date
        ? `Last evidence added 6–18 months ago (${skill.last_evidence_date})`
        : 'Last evidence 6–18 months ago',
    },
    cooling: {
      label: 'Cooling',
      icon: TrendingDown,
      style: 'bg-rose-500/15 text-rose-400/80 border-rose-500/30',
      tooltip: skill.last_evidence_date
        ? `No evidence added in 18+ months (${skill.last_evidence_date})`
        : 'No evidence recorded in 18+ months',
    },
  };

  const VelConfig = velocityConfig[velocity] || velocityConfig.cooling;
  const VelIcon = VelConfig.icon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card-hover rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden border border-border"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-heading text-h3 font-bold text-text-primary">{skill.name}</h3>
            <span className="text-label text-text-muted">{skill.category}</span>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* CCS Score Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs font-bold text-accent">
              <span>CCS:</span>
              <span className="text-sm">{ccs}</span>
            </div>

            {/* Velocity Indicator Badge */}
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${VelConfig.style}`}
              title={VelConfig.tooltip}
            >
              <VelIcon className="w-3 h-3" />
              <span>{VelConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {skill.description && (
          <p className="text-xs text-text-secondary mb-4 line-clamp-2 leading-relaxed font-sans">{skill.description}</p>
        )}

        {/* CCS Animated Progress Bar */}
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Progress Bar</span>
            <span className="font-bold text-text-primary">{ccs}/100</span>
          </div>
          <div className="w-full h-3 bg-surface-elevated rounded-full overflow-hidden p-0.5 border border-border">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(5, ccs)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-accent via-indigo-500 to-emerald-400 shadow-accent-glow"
            ></motion.div>
          </div>
        </div>

        {/* Evidence Breakdown Summary */}
        <div className="flex items-center gap-3 text-xs font-mono text-text-secondary mb-4 flex-wrap">
          {Object.entries(breakdown).slice(0, 4).map(([key, count]) => (
            <span key={key}>
              <strong className="text-accent">{count}</strong> {key}
            </span>
          ))}
        </div>

        {/* Badges for Derived Flags */}
        <div className="flex flex-col gap-2">
          {skill.unanchored && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit">
              <HelpCircle className="w-3.5 h-3.5" />
              Claimed · No formal evidence
            </span>
          )}
          {skill.evidence_breadth_gap && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 w-fit">
              <AlertTriangle className="w-3.5 h-3.5" />
              No project evidence
            </span>
          )}
          {!skill.unanchored && !skill.evidence_breadth_gap && ccs >= 50 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified evidence anchor
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
