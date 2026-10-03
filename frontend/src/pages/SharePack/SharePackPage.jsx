import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Calendar, Clock, AlertTriangle, Layers, Award, ArrowLeft, Download } from 'lucide-react';
import { api } from '../../services/api';
import { AchievementCard } from '../../components/achievements/AchievementCard';
import { SkillCard } from '../../components/skills/SkillCard';
import { exportEvidenceDossier } from '../../utils/exportEvidence';
import { usePageTitle } from '../../hooks/usePageTitle';

export const SharePackPage = () => {
  usePageTitle('Evidence Pack');
  const { token } = useParams();

  const { data: pack, isLoading, error } = useQuery({
    queryKey: ['share-pack', token],
    queryFn: () => api.getSharePack(token),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 space-y-6">
        <div className="h-10 w-64 bg-surface-elevated animate-pulse rounded-xl"></div>
        <div className="h-64 bg-surface border border-border animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (error || !pack) {
    const isExpired = error?.message?.includes('expired') || error?.status === 410;
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center glass-card rounded-2xl p-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h1 className="font-heading text-h2 font-bold text-text-primary">
          {isExpired ? 'Evidence Pack Expired' : 'Share Pack Not Found'}
        </h1>
        <p className="text-xs text-text-secondary font-sans max-w-md mx-auto">
          {isExpired
            ? 'This role-specific evidence pack link has reached its time-to-live limit and expired.'
            : 'The requested evidence pack link is invalid or no longer exists.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-xs font-semibold hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View Full Portfolio</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Evidence Pack Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent/10 text-accent border border-accent/30 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Role-Specific Evidence Pack
              </span>
            </div>
            <h1 className="font-heading text-hero text-text-primary leading-tight">
              Curated Evidence Dossier
            </h1>
            <p className="text-xs text-text-secondary mt-1 font-sans">
              Hand-picked credentials and verified skills matched against target role requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => exportEvidenceDossier(pack.achievements || [], pack.skills || [], [])}
              className="px-4 py-2 rounded-xl bg-accent text-white font-semibold text-xs shadow-accent-glow hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Evidence Dossier</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-surface-elevated px-4 py-2 rounded-xl border border-border">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Expires: <strong>{new Date(pack.expires_at).toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Matched Keywords Badges */}
        {pack.jd_keywords && pack.jd_keywords.length > 0 && (
          <div className="space-y-2">
            <span className="text-label text-text-muted block uppercase font-mono">Matched Competency Keywords</span>
            <div className="flex flex-wrap gap-2">
              {pack.jd_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-accent/10 text-accent border border-accent/25"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Matched Achievements Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-h2 font-bold text-text-primary flex items-center gap-2">
            <Award className="w-6 h-6 text-accent" />
            Matched Credentials ({pack.achievements?.length || 0})
          </h2>
        </div>

        {pack.achievements && pack.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pack.achievements.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center text-text-muted text-xs">
            No specific achievements linked to this pack.
          </div>
        )}
      </div>

      {/* Matched Skills Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-h2 font-bold text-text-primary flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Matched Skills & CCS ({pack.skills?.length || 0})
          </h2>
        </div>

        {pack.skills && pack.skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pack.skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center text-text-muted text-xs">
            No specific skill metrics linked to this pack.
          </div>
        )}
      </div>

      {/* Bottom CTA to Full Portfolio */}
      <div className="text-center pt-8 border-t border-border">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-semibold text-xs shadow-accent-glow hover:scale-105 transition-all"
        >
          <span>View Full Shyamarks Portfolio →</span>
        </Link>
      </div>
    </div>
  );
};
