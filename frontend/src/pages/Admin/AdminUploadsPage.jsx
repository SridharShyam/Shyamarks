import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadCloud, Trash2, FileText, Image as ImageIcon, Copy, Check, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { FileUploadZone } from '../../components/ui/FileUploadZone';

export const AdminUploadsPage = () => {
  const queryClient = useQueryClient();
  const [copiedFilename, setCopiedFilename] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: uploads, isLoading } = useQuery({
    queryKey: ['admin-uploads-list'],
    queryFn: () => api.getUploads(),
  });

  const deleteMutation = useMutation({
    mutationFn: (filename) => api.deleteUpload(filename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-uploads-list'] });
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to delete upload file');
    },
  });

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-uploads-list'] });
  };

  const handleCopyLink = (url, filename) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedFilename(filename);
    setTimeout(() => setCopiedFilename(''), 2000);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-heading text-h1 font-bold text-text-primary flex items-center gap-3">
          <UploadCloud className="w-8 h-8 text-accent" />
          Uploads & Evidence Assets Directory
        </h1>
        <p className="text-xs text-text-secondary mt-1 font-sans">
          Full CRUD access to view, upload, replace, copy links, and delete all uploaded PDFs, images, and evidence files.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-accent" />
          <span>Upload New Evidence Asset (PDF, PNG, JPG, WEBP — Max 10MB)</span>
        </h2>
        <FileUploadZone onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Uploads List Table */}
      <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            Stored Uploads ({uploads?.length || 0})
          </span>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-uploads-list'] })}
            className="p-1.5 rounded-lg bg-surface-elevated border border-border text-text-muted hover:text-text-primary transition-colors text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated border-b border-border text-text-muted uppercase font-mono">
              <tr>
                <th className="px-6 py-4">Asset Preview & Filename</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    Loading upload assets...
                  </td>
                </tr>
              ) : uploads && uploads.length > 0 ? (
                uploads.map((file) => (
                  <tr key={file.filename} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {file.file_type === 'pdf' ? (
                          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-rose-400" />
                          </div>
                        ) : (
                          <img
                            src={file.file_url}
                            alt={file.filename}
                            className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-mono text-xs font-semibold text-text-primary truncate max-w-xs">
                            {file.filename}
                          </div>
                          <div className="text-[10px] text-text-muted font-mono truncate max-w-sm">
                            {file.file_url}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                        file.file_type === 'pdf'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {file.file_type}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-text-muted">
                      {formatBytes(file.file_size)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyLink(file.file_url, file.filename)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
                          title="Copy File URL"
                        >
                          {copiedFilename === file.filename ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Copy URL</span>
                            </>
                          )}
                        </button>

                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-surface-elevated border border-border text-text-secondary hover:text-accent transition-colors"
                          title="View / Open File"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${file.filename}"?`)) {
                              deleteMutation.mutate(file.filename);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-surface-elevated border border-border text-text-muted hover:text-rose-400 transition-colors"
                          title="Delete Upload Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    No uploaded assets found in storage directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
