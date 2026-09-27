import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const displayUrl = fileUrl || previewImageUrl;
  const isPdf = fileType?.toLowerCase() === 'pdf' || (fileUrl && fileUrl.toLowerCase().endsWith('.pdf'));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[85vh] bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-elevated">
              <div className="flex items-center gap-3 pr-4">
                <FileText className="w-5 h-5 text-accent shrink-0" />
                <h3 className="font-heading font-semibold text-text-primary truncate max-w-lg">{title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {verificationUrl && (
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 border border-accent/30 transition-colors"
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
                    className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    title="Download Evidence File"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
                  title="Close Preview (ESC)"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 bg-background p-4 flex items-center justify-center overflow-auto">
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
                  <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary text-sm">No direct file preview available for this credential.</p>
                  {verificationUrl && (
                    <a
                      href={verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all"
                    >
                      View Verification Page
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
