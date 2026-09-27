import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, ExternalLink, FileText, Sparkles, CheckCircle } from 'lucide-react';
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
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#0ea5e9', '#06b6d4', '#10b981'],
    });
    setIsLightboxOpen(true);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Certification':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Internship':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Project':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Award':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Virtual Experience':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass-card-hover rounded-2xl p-6 flex flex-col justify-between shadow-lg relative group overflow-hidden border border-obsidian-750 light:border-slate-200"
      >
        {/* Subtle Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-cyanGlow-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                className="p-1.5 rounded-lg bg-obsidian-850 hover:bg-brand-500/20 text-slate-400 hover:text-brand-300 border border-obsidian-750 transition-all shrink-0 hover:scale-110"
                title="Quick Evidence Preview & Proof Verification"
              >
                <FileText className="w-4 h-4 text-brand-400" />
              </button>
            )}
          </div>

          {/* Title */}
          <Link to={`/achievements/${achievement.slug}`} className="block group-hover:text-brand-300 transition-colors">
            <h4 className="text-base font-bold text-slate-100 light:text-slate-900 line-clamp-2 mb-2 leading-snug">
              {achievement.title}
            </h4>
          </Link>

          {/* Issuer & Date */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
            {achievement.issuer && (
              <span className="font-semibold text-slate-300 light:text-slate-700 truncate max-w-[180px]">
                {achievement.issuer.name}
              </span>
            )}
            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
              <Calendar className="w-3 h-3 text-brand-400" />
              {achievement.issued_date}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300/90 light:text-slate-600 line-clamp-3 mb-4 leading-relaxed">
            {achievement.description}
          </p>

          {/* Skill tags */}
          {achievement.skills && achievement.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {achievement.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-obsidian-900/80 light:bg-slate-200 text-slate-300 light:text-slate-700 border border-obsidian-750 light:border-slate-300 hover:border-brand-400/40 transition-colors"
                >
                  {skill.name}
                </span>
              ))}
              {achievement.skills.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-obsidian-900 border border-obsidian-750">
                  +{achievement.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-obsidian-750/60 light:border-slate-200 flex items-center justify-between text-xs">
          <Link
            to={`/achievements/${achievement.slug}`}
            className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            <span>View Proof Detail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {achievement.credential_id && (
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={`ID: ${achievement.credential_id}`}>
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
