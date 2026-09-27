import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { TimelineHeatmap } from '../../components/ui/TimelineHeatmap';
import { Achievement } from '../../types';

export const TimelinePage: React.FC = () => {
  const { data: achievementsRes, isLoading } = useQuery({
    queryKey: ['achievements-timeline'],
    queryFn: () => api.getAchievements({ limit: 1000, sort: 'newest' }),
  });

  const achievements = achievementsRes?.items || [];

  const groupedByYear = useMemo(() => {
    const map: Record<string, Achievement[]> = {};
    achievements.forEach((ach) => {
      const year = ach.issued_date ? ach.issued_date.substring(0, 4) : 'Unknown';
      if (!map[year]) map[year] = [];
      map[year].push(ach);
    });
    // Sort years descending
    const sortedYears = Object.keys(map).sort((a, b) => b.localeCompare(a));
    return sortedYears.map((yr) => ({
      year: yr,
      items: map[yr],
    }));
  }, [achievements]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Calendar className="w-8 h-8 text-brand-400" />
          Chronological Milestone Timeline
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical record of earned credentials, certifications, hackathons, and evidence milestones grouped by year.
        </p>
      </div>

      {/* Timeline Density Heatmap */}
      <TimelineHeatmap achievements={achievements} />

      {/* Grouped Years Timeline */}
      {isLoading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-surface-800/40 border border-surface-700/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : groupedByYear.length > 0 ? (
        <div className="space-y-12">
          {groupedByYear.map((group) => (
            <div key={group.year} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black font-mono text-brand-300 bg-brand-500/10 border border-brand-500/30 px-4 py-1 rounded-xl">
                  {group.year}
                </span>
                <div className="h-px bg-surface-700 flex-1"></div>
                <span className="text-xs font-mono text-slate-400">
                  {group.items.length} milestone{group.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="relative border-l-2 border-surface-700/80 ml-6 space-y-6">
                {group.items.map((ach) => (
                  <div key={ach.id} className="relative pl-6">
                    {/* Node Dot */}
                    <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-brand-500 border-4 border-surface-900 shadow-sm shadow-brand-500/50"></div>

                    {/* Timeline Item Card */}
                    <div className="bg-surface-800/60 hover:bg-surface-800 border border-surface-700/80 hover:border-brand-500/40 rounded-2xl p-5 transition-all shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                              {ach.type}
                            </span>
                            {ach.issuer && (
                              <span className="text-xs font-medium text-slate-300">
                                via {ach.issuer.name}
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/achievements/${ach.slug}`}
                            className="text-base font-bold text-slate-100 hover:text-brand-300 transition-colors"
                          >
                            {ach.title}
                          </Link>
                        </div>
                        <span className="text-xs font-mono text-slate-400 shrink-0">
                          {ach.issued_date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300/90 line-clamp-2 mb-3">
                        {ach.description}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-surface-700/50">
                        <Link
                          to={`/achievements/${ach.slug}`}
                          className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1"
                        >
                          <span>View Detail & Verification</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        {ach.credential_id && (
                          <span className="font-mono text-[10px] text-slate-500">
                            ID: {ach.credential_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-800/40 border border-surface-700/60 rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-sm">No timeline events recorded.</p>
        </div>
      )}
    </div>
  );
};
