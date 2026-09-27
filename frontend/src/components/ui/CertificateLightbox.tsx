import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';

interface CertificateLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl?: string;
  fileType?: string;
  previewImageUrl?: string;
  verificationUrl?: string;
}

export const CertificateLightbox: React.FC<CertificateLightboxProps> = ({
  isOpen,
  onClose,
  title,
  fileUrl,
  fileType,
  previewImageUrl,
  verificationUrl,
}) => {
  if (!isOpen) return null;

  const displayUrl = fileUrl || previewImageUrl;
  const isPdf = fileType?.toLowerCase() === 'pdf' || (fileUrl && fileUrl.toLowerCase().endsWith('.pdf'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-5xl h-[85vh] bg-surface-900 border border-surface-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700 bg-surface-800/50">
          <div className="flex items-center gap-3 pr-4">
            <FileText className="w-5 h-5 text-brand-400 shrink-0" />
            <h3 className="font-semibold text-slate-100 truncate max-w-lg">{title}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {verificationUrl && (
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors"
              >
                <span>Verify Credential</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {displayUrl && (
              <a
                href={displayUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-surface-700 transition-colors"
                title="Download Evidence File"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
              title="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-surface-950 p-4 flex items-center justify-center overflow-auto">
          {isPdf && fileUrl ? (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0 rounded-lg bg-white"
              title={`PDF Preview - ${title}`}
            />
          ) : previewImageUrl || fileUrl ? (
            <img
              src={previewImageUrl || fileUrl}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="text-center py-16 px-4">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">No direct file preview available for this credential.</p>
              {verificationUrl && (
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  View Verification Page
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
