import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, HelpCircle, Calendar, ArrowRight, X, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { fadeUp, staggerContainer } from '../../lib/animations';
import { usePageTitle } from '../../hooks/usePageTitle';

export const LearningPathsPage = () => {
  usePageTitle('Learning Paths');
  const [selectedPathInfo, setSelectedPathInfo] = useState(null);

  const { data: paths, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: () => api.getLearningPaths(),
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="font-heading text-h1 font-bold text-text-primary flex items-center gap-3">
          <Compass className="w-8 h-8 text-accent animate-spin-slow" />
          Learning Paths
        </h1>
        <p className="text-xs text-text-secondary mt-1 max-w-3xl font-sans">
          Trajectories inferred algorithmically from your achievement history using graph-clustering over shared skill domains and temporal continuity.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-48 animate-pulse space-y-4">
              <div className="h-6 w-48 bg-surface-elevated rounded-lg"></div>
              <div className="h-2 w-full bg-surface-elevated rounded-full"></div>
            </div>
          ))}
        </div>
      ) : paths && paths.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {paths.map((path) => {
            const startYear = path.date_range?.start ? path.date_range.start.split('-')[0] : '';
            const endYear = path.date_range?.end ? path.date_range.end.split('-')[0] : '';

            return (
              <motion.div
                key={path.id}
                variants={fadeUp}
                className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl backdrop-blur-xl"
              >
                {/* Track Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-h2 font-bold text-text-primary">
                        {path.name}
                      </h2>
                      <button
                        onClick={() => setSelectedPathInfo(path)}
                        className="p-1 rounded-full text-text-muted hover:text-accent hover:bg-surface-elevated transition-colors"
                        title="Why this path?"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 font-sans">
                      {path.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-accent bg-accent/10 border border-accent/30 px-3.5 py-1.5 rounded-full shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{path.milestone_count} Milestones</span>
                    <span>·</span>
                    <span>{startYear}–{endYear}</span>
                  </div>
                </div>

                {/* Horizontal Track Layout (Desktop / Tablet) */}
                <div className="hidden md:block relative pt-6 pb-2">
                  {/* Track Axis Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent/40 -translate-y-1/2 z-0"></div>

                  <div className="flex items-center justify-between relative z-10">
                    {path.achievements.map((ach, idx) => (
                      <div key={ach.id} className="flex flex-col items-center group relative">
                        {/* Milestone Node Dot */}
                        <Link
                          to={`/achievements/${ach.slug}`}
                          className="w-5 h-5 rounded-full bg-accent border-4 border-surface shadow-accent-glow group-hover:scale-125 transition-transform z-10 cursor-pointer"
                        />

                        {/* Title & Date Label below node */}
                        <div className="mt-4 text-center max-w-[140px] space-y-1">
                          <Link
                            to={`/achievements/${ach.slug}`}
                            className="font-bold text-xs text-text-primary group-hover:text-accent transition-colors line-clamp-2"
                          >
                            {ach.title}
                          </Link>
                          <span className="font-mono text-[10px] text-text-muted block">
                            {ach.issued_date}
                          </span>
                        </div>

                        {/* Hover Tooltip Popup */}
                        <div className="absolute bottom-full mb-3 hidden group-hover:block z-30 w-48 p-3 rounded-xl bg-surface-elevated border border-border text-xs shadow-2xl pointer-events-none">
                          <div className="font-bold text-text-primary">{ach.title}</div>
                          <div className="text-[10px] text-text-muted mt-0.5">{ach.issued_date}</div>
                          {ach.issuer && (
                            <div className="text-[10px] text-accent mt-1">Issued by {ach.issuer.name}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vertical Track Layout (Mobile Fallback) */}
                <div className="block md:hidden space-y-4 pt-2">
                  <div className="relative border-l-2 border-accent/40 pl-6 space-y-6 ml-2">
                    {path.achievements.map((ach) => (
                      <div key={ach.id} className="relative group">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-surface shadow-accent-glow" />
                        <Link
                          to={`/achievements/${ach.slug}`}
                          className="block p-3 rounded-xl bg-surface-elevated border border-border hover:border-accent transition-colors"
                        >
                          <div className="font-bold text-xs text-text-primary">{ach.title}</div>
                          <div className="font-mono text-[10px] text-text-muted mt-1">{ach.issued_date}</div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center space-y-3">
          <Compass className="w-12 h-12 text-text-muted mx-auto" />
          <h2 className="text-lg font-bold text-text-primary">No Learning Paths Inferred Yet</h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Paths require multiple achievements sharing skills within an 18-month timeline window. Add more credentials to generate learning trajectories!
          </p>
        </div>
      )}

      {/* "Why this path?" Modal */}
      {selectedPathInfo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedPathInfo(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-accent font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Inference Logic — {selectedPathInfo.name}</span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              This learning path was algorithmically inferred because these {selectedPathInfo.milestone_count} achievements share the primary skill domains:
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedPathInfo.primary_skill_names?.map((skillName, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-accent/10 text-accent border border-accent/30"
                >
                  {skillName}
                </span>
              ))}
            </div>

            <p className="text-xs text-text-muted pt-2 border-t border-border font-mono">
              Timeline span: {selectedPathInfo.date_range?.start} to {selectedPathInfo.date_range?.end} (within max 540-day proximity rule).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
