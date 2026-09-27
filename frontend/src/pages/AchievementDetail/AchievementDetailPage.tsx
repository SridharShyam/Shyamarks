import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  FolderGit2,
  Briefcase,
  FileText,
  Download,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { CertificateLightbox } from '../../components/ui/CertificateLightbox';

export const AchievementDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: achievement, isLoading, error } = useQuery({
    queryKey: ['achievement-detail', slug],
    queryFn: () => api.getAchievementBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <div className="h-8 w-48 bg-surface-800 animate-pulse rounded-lg"></div>
        <div className="h-96 bg-surface-800/50 border border-surface-700/80 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (error || !achievement) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-surface-800/40 border border-surface-700/60 rounded-2xl p-12 space-y-4">
        <Award className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Achievement Not Found</h2>
        <p className="text-xs text-slate-400">The requested achievement credential slug could not be located or is private.</p>
        <Link
          to="/achievements"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explorer</span>
        </Link>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const isPdf = achievement.file_type?.toLowerCase() === 'pdf' || achievement.file_url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      <Link
        to="/achievements"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Achievement Explorer</span>
      </Link>

      {/* Main Detail Header Card */}
      <div className="bg-surface-800/80 border border-surface-700/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30">
                {achievement.type}
              </span>
              {achievement.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                  ★ Featured
                </span>
              )}
              {achievement.visibility !== 'public' && (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {achievement.visibility}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {achievement.title}
            </h1>

            {achievement.issuer && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Issued by <strong>{achievement.issuer.name}</strong></span>
                {achievement.issuer.website && (
                  <a
                    href={achievement.issuer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 hover:underline inline-flex items-center gap-0.5 text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Verification QR Code */}
          <div className="bg-surface-900 border border-surface-700 p-3 rounded-xl flex flex-col items-center gap-2 shrink-0 self-start sm:self-auto">
            <QRCodeSVG value={achievement.verification_url || currentUrl} size={90} bgColor="#0d1117" fgColor="#36abfa" />
            <span className="text-[10px] font-mono text-slate-400">Scan to Verify</span>
          </div>
        </div>

        {/* Metadata Dates & IDs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-700/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-brand-400" />
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase">Issued Date</span>
              <strong className="font-mono">{achievement.issued_date}</strong>
            </div>
          </div>

          {achievement.expiry_date && (
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Expiration Date</span>
                <strong className="font-mono">{achievement.expiry_date}</strong>
              </div>
            </div>
          )}

          {achievement.credential_id && (
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="truncate">
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Credential ID</span>
                <strong className="font-mono text-emerald-300 truncate block">{achievement.credential_id}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {achievement.verification_url && (
            <a
              href={achievement.verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-600/30"
            >
              <span>Verify Official Credential</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {(achievement.file_url || achievement.preview_image_url) && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 text-slate-100 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Preview Evidence Media</span>
            </button>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white">Credential Description & Scope</h3>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {achievement.description}
        </p>

        {achievement.tags && achievement.tags.length > 0 && (
          <div className="pt-4 flex flex-wrap gap-2">
            {achievement.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-surface-900 text-slate-400 border border-surface-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Embedded Preview Container */}
      {(achievement.file_url || achievement.preview_image_url) && (
        <div className="bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-400" />
              Evidence Document Preview
            </h3>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
            >
              Expand Full Screen Lightbox
            </button>
          </div>

          <div className="w-full h-[500px] bg-surface-950 border border-surface-700 rounded-xl overflow-hidden flex items-center justify-center">
            {isPdf && achievement.file_url ? (
              <iframe
                src={achievement.file_url}
                className="w-full h-full border-0 bg-white"
                title={`Embedded PDF - ${achievement.title}`}
              />
            ) : (
              <img
                src={achievement.preview_image_url || achievement.file_url}
                alt={achievement.title}
                className="max-w-full max-h-full object-contain cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* Linked Graph Entities: Skills, Projects, Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Linked Skills */}
        <div className="bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-white flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-purple-400" />
            Validated Skills
          </h4>
          {achievement.skills && achievement.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {achievement.skills.map((s) => (
                <div key={s.id} className="px-3 py-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-200 text-xs flex items-center gap-2">
                  <span className="font-medium">{s.name}</span>
                  {s.ccs !== undefined && (
                    <span className="font-mono text-[10px] text-brand-400 font-bold">CCS: {s.ccs}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No skills directly linked to this record.</p>
          )}
        </div>

        {/* Linked Projects */}
        <div className="bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-white flex items-center gap-2 text-sm">
            <FolderGit2 className="w-4 h-4 text-blue-400" />
            Related Projects
          </h4>
          {achievement.projects && achievement.projects.length > 0 ? (
            <div className="space-y-2">
              {achievement.projects.map((p) => (
                <div key={p.id} className="p-2.5 rounded-lg bg-surface-900 border border-surface-700 text-xs">
                  <div className="font-bold text-slate-200">{p.title}</div>
                  <p className="text-slate-400 text-[11px] line-clamp-1">{p.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No projects linked to this record.</p>
          )}
        </div>

        {/* Linked Experiences */}
        <div className="bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-white flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Related Experiences
          </h4>
          {achievement.experiences && achievement.experiences.length > 0 ? (
            <div className="space-y-2">
              {achievement.experiences.map((e) => (
                <div key={e.id} className="p-2.5 rounded-lg bg-surface-900 border border-surface-700 text-xs">
                  <div className="font-bold text-slate-200">{e.title}</div>
                  <p className="text-slate-400 text-[11px]">{e.organization} — {e.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No experience roles linked to this record.</p>
          )}
        </div>
      </div>

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
    </div>
  );
};
