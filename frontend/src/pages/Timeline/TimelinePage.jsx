import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { TimelineHeatmap } from '../../components/ui/TimelineHeatmap';

export const TimelinePage = () => {
  const { data: achievementsRes, isLoading } = useQuery({
    queryKey: ['achievements-timeline'],
    queryFn: () => api.getAchievements({ limit: 1000, sort: 'newest' }),
  });

  const achievements = achievementsRes?.items || [];

  const groupedByYear = useMemo(() => {
    const map = {};
    achievements.forEach((ach) => {
      const year = ach.issued_date ? ach.issued_date.substring(0, 4) : 'Unknown';
      if (!map[year]) map[year] = [];
      map[year].push(ach);
    });
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
        <h1 className="font-heading text-h1 font-bold text-text-primary flex items-center gap-3">
          <Calendar className="w-8 h-8 text-accent" />
          Chronological Milestone Timeline
        </h1>
        <p className="text-xs text-text-secondary mt-1 font-sans">
          Historical record of earned credentials, certifications, hackathons, and evidence milestones grouped by year.
        </p>
      </div>

      {/* Timeline Density Heatmap ABOVE year-grouped timeline */}
      <TimelineHeatmap achievements={achievements} />

      {/* Grouped Years Timeline */}
      {isLoading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 glass-card rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : groupedByYear.length > 0 ? (
        <div className="space-y-12">
          {groupedByYear.map((group) => (
            <div key={group.year} className="space-y-6">
              {/* Year header with horizontal rule extending right */}
              <div className="flex items-center gap-4">
                <h2 className="font-heading text-h2 font-bold text-text-primary bg-surface-elevated border border-border px-4 py-1 rounded-xl font-mono">
                  {group.year}
                </h2>
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs font-mono text-text-muted">
                  {group.items.length} milestone{group.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Entries per year: vertical line on left, dot marker at accent color */}
              <div className="relative border-l-2 border-border ml-6 space-y-6">
                {group.items.map((ach) => (
                  <div key={ach.id} className="relative pl-6">
                    {/* Dot Marker at accent color */}
                    <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-accent border-4 border-background shadow-accent-glow"></div>

                    {/* Timeline Item Card */}
                    <div className="glass-card-hover rounded-2xl p-5 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-accent/10 text-accent border border-accent/20">
                              {ach.type}
                            </span>
                            {ach.issuer && (
                              <span className="text-xs font-medium text-text-secondary">
                                via {ach.issuer.name}
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/achievements/${ach.slug}`}
                            className="font-heading font-bold text-text-primary hover:text-accent transition-colors"
                          >
                            {ach.title}
                          </Link>
                        </div>
                        <span className="text-xs font-mono text-text-muted shrink-0">
                          {ach.issued_date}
                        </span>
                      </div>

                      <p className="text-xs text-text-secondary line-clamp-2 mb-3 font-sans">
                        {ach.description}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                        <Link
                          to={`/achievements/${ach.slug}`}
                          className="text-accent hover:underline font-semibold inline-flex items-center gap-1"
                        >
                          <span>View Detail & Verification</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        {ach.credential_id && (
                          <span className="font-mono text-[10px] text-text-muted">
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
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-text-muted text-sm font-sans">No timeline events recorded.</p>
        </div>
      )}
    </div>
  );
};
