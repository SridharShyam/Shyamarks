import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Achievement } from '../../types';
import { CertificateLightbox } from '../ui/CertificateLightbox';

interface AchievementCardProps {
  achievement: Achievement;
  showAdminControls?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, showAdminControls }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6C63FF', '#22D3A5', '#F59E0B', '#38BDF8'],
    });
    setIsLightboxOpen(true);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Certification':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'Internship':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Virtual Experience':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Workshop':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Course':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Competition':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Award':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Project':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Hackathon':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Training':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'Publication':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass-card-hover rounded-2xl p-6 flex flex-col justify-between relative group overflow-hidden border border-border"
      >
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-emerald-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div>
          {/* Header Badge Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-mono border ${getTypeBadgeColor(achievement.type)}`}>
                {achievement.type}
              </span>
              {achievement.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Featured
                </span>
              )}
              {showAdminControls && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                  achievement.visibility === 'public' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                  achievement.visibility === 'unlisted' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                  'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}>
                  {achievement.visibility}
                </span>
              )}
            </div>

            {/* Quick Evidence Preview */}
            {(achievement.file_url || achievement.preview_image_url) && (
              <button
                onClick={handleConfetti}
                className="p-1.5 rounded-lg bg-surface-elevated hover:bg-accent/20 text-text-muted hover:text-accent border border-border transition-all shrink-0 hover:scale-110"
                title="Quick Evidence Preview & Proof Verification"
              >
                <FileText className="w-4 h-4 text-accent" />
              </button>
            )}
          </div>

          {/* Title */}
          <Link to={`/achievements/${achievement.slug}`} className="block group-hover:text-accent transition-colors">
            <h3 className="font-heading text-h3 font-bold text-text-primary line-clamp-2 mb-2 leading-snug">
              {achievement.title}
            </h3>
          </Link>

          {/* Issuer & Date */}
          <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
            {achievement.issuer && (
              <span className="font-semibold text-text-primary truncate max-w-[180px]">
                {achievement.issuer.name}
              </span>
            )}
            <span className="flex items-center gap-1 font-mono text-[11px] text-text-muted">
              <Calendar className="w-3 h-3 text-accent" />
              {achievement.issued_date}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-text-secondary line-clamp-3 mb-4 leading-relaxed font-sans">
            {achievement.description}
          </p>

          {/* Skill tags */}
          {achievement.skills && achievement.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {achievement.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-elevated text-text-secondary border border-border hover:border-accent/40 transition-colors"
                >
                  {skill.name}
                </span>
              ))}
              {achievement.skills.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-text-muted bg-surface-elevated border border-border">
                  +{achievement.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <Link
            to={`/achievements/${achievement.slug}`}
            className="text-accent hover:underline font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            <span>→ View Achievement</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {achievement.credential_id && (
            <span className="font-mono text-[10px] text-text-muted truncate max-w-[120px]" title={`ID: ${achievement.credential_id}`}>
              ID: {achievement.credential_id}
            </span>
          )}
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <CertificateLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={achievement.title}
        fileUrl={achievement.file_url}
        fileType={achievement.file_type}
        previewImageUrl={achievement.preview_image_url}
        verificationUrl={achievement.verification_url}
      />
    </>
  );
};
