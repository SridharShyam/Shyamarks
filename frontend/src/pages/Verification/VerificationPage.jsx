import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, CheckCircle2, XCircle, Copy, Check, ArrowLeft, ExternalLink, Award } from 'lucide-react';
import { api } from '../../services/api';

// SHA-256 client-side fingerprint generator matching backend logic
async function generateClientFingerprint(title, issuerName, issuedDate, credentialId = "") {
  const raw = `${(title || '').trim().toLowerCase()}|${(issuerName || '').trim().toLowerCase()}|${issuedDate}|${(credentialId || '').trim().toLowerCase()}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  let fingerprint = '';
  for (let i = 0; i < 48; i += 4) {
    fingerprint += hex[i];
  }
  return fingerprint;
}

export const VerificationPage = () => {
  const { fingerprint } = useParams();
  const [clientVerified, setClientVerified] = useState(null);
  const [recomputedFp, setRecomputedFp] = useState('');
  const [copied, setCopied] = useState(false);

  const { data: achievement, isLoading, error } = useQuery({
    queryKey: ['verify-fingerprint', fingerprint],
    queryFn: () => api.verifyFingerprint(fingerprint),
    retry: false,
  });

  useEffect(() => {
    if (achievement) {
      const issuerName = achievement.issuer ? achievement.issuer.name : '';
      generateClientFingerprint(
        achievement.title || '',
        issuerName,
        achievement.issued_date || '',
        achievement.credential_id || ''
      ).then((calcFp) => {
        setRecomputedFp(calcFp);
        setClientVerified(calcFp.toUpperCase() === (fingerprint || '').toUpperCase());
      }).catch(() => {
        setClientVerified(false);
      });
    }
  }, [achievement, fingerprint]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedFp = fingerprint
    ? `${fingerprint.slice(0, 6)} · ${fingerprint.slice(6)}`
    : '';

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/achievements"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Achievements</span>
        </Link>
        <div className="flex items-center gap-1.5 font-mono text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Proof Verification Protocol</span>
        </div>
      </div>

      {/* Main Verification Card */}
      <div className="bg-surface-800/90 border border-surface-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            🔍 Verifying Achievement...
          </h1>
          <div className="font-mono text-sm text-slate-400 tracking-wider">
            Fingerprint: <span className="text-brand-300 font-bold">{formattedFp}</span>
          </div>
        </div>

        {/* Status Display */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-slate-400">Querying cryptographic ledger...</p>
          </div>
        ) : error || !achievement ? (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 text-rose-300 space-y-3">
            <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Achievement Not Found</h2>
            <p className="text-xs text-rose-200/80 max-w-md mx-auto">
              No public record matches the fingerprint <code className="font-mono bg-rose-950/50 px-1.5 py-0.5 rounded">{fingerprint}</code>.
              The credential may be unlisted, deleted, or altered.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-emerald-500/10 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>✓ Cryptographically Verified Record</span>
            </div>

            {/* Achievement Details Card */}
            <div className="bg-surface-900/80 border border-surface-700/80 rounded-xl p-6 text-left space-y-4 shadow-inner">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                    {achievement.type}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">
                    {achievement.title}
                  </h2>
                  {achievement.issuer && (
                    <p className="text-xs text-slate-400 mt-1">
                      Issued by <span className="text-slate-200 font-semibold">{achievement.issuer.name}</span> · {achievement.issued_date}
                    </p>
                  )}
                </div>

                <Link
                  to={`/achievements/${achievement.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-md shadow-brand-600/30 transition-colors"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-surface-700/60 pt-3">
                {achievement.description}
              </p>

              {achievement.credential_id && (
                <div className="font-mono text-xs text-slate-400 pt-1">
                  Credential ID: <span className="text-slate-200">{achievement.credential_id}</span>
                </div>
              )}
            </div>

            {/* Client-side Match Verification */}
            <div className="bg-surface-900/40 border border-surface-700/60 rounded-xl p-4 text-xs font-mono space-y-2 text-left">
              <div className="flex items-center justify-between text-slate-400">
                <span>Client-Side SHA-256 Digest:</span>
                {clientVerified ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Client-Side Verified ✓
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">Computing Digest...</span>
                )}
              </div>
              <div className="bg-surface-950 p-2.5 rounded border border-surface-800 text-slate-300 truncate">
                {recomputedFp || 'Calculating SHA-256...'}
              </div>
            </div>

            {/* Share / Copy Verification Link */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={copyUrl}
                className="px-4 py-2 rounded-xl bg-surface-900 border border-surface-700 hover:bg-surface-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Verification Link Copied!' : 'Copy Permanent Verification Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
