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
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { CertificateLightbox } from '../../components/ui/CertificateLightbox';
import { useToast } from '../../context/ToastContext';

export const AchievementDetailPage = () => {
  const { slug } = useParams();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { showToast } = useToast();

  const { data: achievement, isLoading, error } = useQuery({
    queryKey: ['achievement-detail', slug],
    queryFn: () => api.getAchievementBySlug(slug),
    enabled: !!slug,
  });

  const handleCopyId = () => {
    if (!achievement?.credential_id) return;
    navigator.clipboard.writeText(achievement.credential_id);
    setCopiedId(true);
    showToast('Credential ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyLink = () => {
    const url = achievement?.verification_url || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Verification link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <div className="h-8 w-48 bg-surface-elevated animate-pulse rounded-lg"></div>
        <div className="h-96 bg-surface border border-border rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (error || !achievement) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 glass-card rounded-2xl p-12 space-y-4">
        <Award className="w-12 h-12 text-text-muted mx-auto" />
        <h2 className="font-heading text-h2 font-bold text-text-primary">Achievement Not Found</h2>
        <p className="text-xs text-text-secondary font-sans">The requested achievement credential slug could not be located or is private.</p>
        <Link
          to="/achievements"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold hover:brightness-110 transition-all"
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
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Achievement Explorer</span>
      </Link>

      {/* Main Detail Hero Header Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono bg-accent/10 text-accent border border-accent/30">
                {achievement.type}
              </span>
              {achievement.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                  ★ Featured
                </span>
              )}
            </div>

            <h1 className="font-heading text-hero text-text-primary leading-tight">
              {achievement.title}
            </h1>

            {achievement.issuer && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Issued by <strong className="text-text-primary">{achievement.issuer.name}</strong></span>
                {achievement.issuer.website && (
                  <a
                    href={achievement.issuer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline inline-flex items-center gap-0.5 text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Verification QR Code Card */}
          <div className="bg-surface-elevated border border-border p-4 rounded-xl flex flex-col items-center gap-3 shrink-0 self-start sm:self-auto shadow-md">
            <QRCodeSVG value={achievement.verification_url || currentUrl} size={100} bgColor="#111118" fgColor="#6C63FF" />
            <span className="text-label text-text-muted">Scan to verify</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-surface border border-border hover:border-accent text-text-secondary hover:text-accent transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Metadata Row with Copyable Credential ID Pill */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border text-xs">
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4 text-accent" />
            <div>
              <span className="text-text-muted block text-label uppercase">Issued Date</span>
              <strong className="font-mono text-text-primary">{achievement.issued_date}</strong>
            </div>
          </div>

          {achievement.expiry_date && (
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-text-muted block text-label uppercase">Expiration Date</span>
                <strong className="font-mono text-text-primary">{achievement.expiry_date}</strong>
              </div>
            </div>
          )}

          {achievement.credential_id && (
            <div className="flex items-center gap-2 text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-text-muted block text-label uppercase">Credential ID</span>
                <button
                  onClick={handleCopyId}
                  className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors"
                  title="Click to copy credential ID"
                >
                  <span>{achievement.credential_id}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
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
              className="px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-accent-glow hover:brightness-110"
            >
              <span>Verify Official Credential</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {(achievement.file_url || achievement.preview_image_url) && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-text-primary font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-accent" />
              <span>Preview Certificate / Evidence</span>
            </button>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-heading text-h3 font-bold text-text-primary">Credential Description & Scope</h3>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line font-sans">
          {achievement.description}
        </p>

        {achievement.tags && achievement.tags.length > 0 && (
          <div className="pt-4 flex flex-wrap gap-2">
            {achievement.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-surface-elevated text-text-muted border border-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Embedded Preview Container */}
      {(achievement.file_url || achievement.preview_image_url) && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-h3 font-bold text-text-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Evidence Document Preview
            </h3>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Expand Lightbox
            </button>
          </div>

          <div className="w-full h-[500px] bg-background border border-border rounded-xl overflow-hidden flex items-center justify-center">
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

      {/* Linked Graph Entities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Linked Skills */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h4 className="font-heading font-bold text-text-primary flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-accent" />
            Validated Skills
          </h4>
          {achievement.skills && achievement.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {achievement.skills.map((s) => (
                <div key={s.id} className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-text-secondary text-xs flex items-center gap-2">
                  <span className="font-medium text-text-primary">{s.name}</span>
                  {s.ccs !== undefined && (
                    <span className="font-mono text-[10px] text-accent font-bold">CCS: {s.ccs}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">No skills directly linked to this record.</p>
          )}
        </div>

        {/* Linked Projects */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h4 className="font-heading font-bold text-text-primary flex items-center gap-2 text-sm">
            <FolderGit2 className="w-4 h-4 text-accent" />
            Related Projects
          </h4>
          {achievement.projects && achievement.projects.length > 0 ? (
            <div className="space-y-2">
              {achievement.projects.map((p) => (
                <div key={p.id} className="p-2.5 rounded-lg bg-surface-elevated border border-border text-xs">
                  <div className="font-bold text-text-primary">{p.title}</div>
                  <p className="text-text-muted text-[11px] line-clamp-1">{p.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">No projects linked to this record.</p>
          )}
        </div>

        {/* Linked Experiences */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h4 className="font-heading font-bold text-text-primary flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Related Experiences
          </h4>
          {achievement.experiences && achievement.experiences.length > 0 ? (
            <div className="space-y-2">
              {achievement.experiences.map((e) => (
                <div key={e.id} className="p-2.5 rounded-lg bg-surface-elevated border border-border text-xs">
                  <div className="font-bold text-text-primary">{e.title}</div>
                  <p className="text-text-muted text-[11px]">{e.organization} — {e.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">No experience roles linked to this record.</p>
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
