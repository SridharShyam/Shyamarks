import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { motion } from 'framer-motion';

export const FileUploadZone = ({
  onUploadSuccess,
  currentFileUrl,
  currentFileType,
  label = "Upload Evidence Document or Certificate (PDF, PNG, JPG, WEBP)"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(
    currentFileUrl ? { url: currentFileUrl, type: currentFileType || 'image' } : null
  );
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 15));
      }, 150);

      const res = await api.uploadFile(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedFile({ url: res.file_url, type: res.file_type });
      onUploadSuccess(res);
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-label text-text-secondary">{label}</label>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] ${
          isDragging
            ? 'border-accent bg-accent/10 scale-[1.01] animate-pulse'
            : uploadedFile
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-border bg-surface-elevated hover:border-accent/50 hover:bg-surface'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        {isUploading ? (
          <div className="space-y-3 w-full max-w-xs">
            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
            <p className="text-xs font-mono text-text-secondary">Uploading file to storage service...</p>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-accent"
              />
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="flex items-center gap-4 w-full">
            <div className="w-16 h-16 rounded-xl bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
              {uploadedFile.type === 'pdf' || uploadedFile.url.endsWith('.pdf') ? (
                <FileText className="w-8 h-8 text-accent" />
              ) : (
                <img src={uploadedFile.url} alt="Upload preview" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 text-left truncate">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>File Uploaded Successfully</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs font-mono text-text-muted truncate">{uploadedFile.url}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(uploadedFile.url);
                  }}
                  className="px-2 py-0.5 text-[10px] bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors border border-accent/20 flex-shrink-0"
                >
                  Copy Link
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
              className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <UploadCloud className="w-10 h-10 text-accent mx-auto animate-float" />
            <p className="text-xs font-semibold text-text-primary">
              Drag & drop evidence file here, or <span className="text-accent underline">browse file</span>
            </p>
            <p className="text-[11px] font-mono text-text-muted">Supports PDF, PNG, JPG, WEBP (Max 10MB)</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-error font-mono flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
};
