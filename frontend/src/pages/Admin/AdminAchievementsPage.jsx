import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, Star, Share2, X, Check, Copy } from 'lucide-react';
import { api } from '../../services/api';

export const AdminAchievementsPage = () => {
  const queryClient = useQueryClient();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [jdText, setJdText] = useState('');
  const [expiresHours, setExpiresHours] = useState(72);
  const [createdPackResult, setCreatedPackResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { data: achievementsRes, isLoading } = useQuery({
    queryKey: ['admin-achievements-list'],
    queryFn: () => api.getAchievements({ limit: 1000 }),
  });

  const handleGeneratePack = async (e) => {
    e.preventDefault();
    if (!jdText.trim()) return;
    setIsGenerating(true);
    try {
      const res = await api.createSharePack(jdText, expiresHours);
      const fullUrl = `${window.location.origin}/share/${res.token}`;
      setCreatedPackResult({ ...res, fullUrl });
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to generate share pack');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateAchievement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-all'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-all'] });
    },
  });

  const achievements = achievementsRes?.items || [];

  const handleToggleVisibility = (ach) => {
    const nextVisibility = {
      public: 'unlisted',
      unlisted: 'private',
      private: 'public',
    };
    updateMutation.mutate({
      id: ach.id,
      data: { visibility: nextVisibility[ach.visibility] },
    });
  };

  const handleToggleFeatured = (ach) => {
    updateMutation.mutate({
      id: ach.id,
      data: { featured: !ach.featured },
    });
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Manage Achievements</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, edit, delete, and control visibility states for all credentials.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              setCreatedPackResult(null);
              setJdText('');
              setIsShareModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-accent" />
            <span>Generate Share Pack</span>
          </button>

          <Link
            to="/admin/achievements/new"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Achievement</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-800/80 border border-surface-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-900/80 border-b border-surface-700 text-slate-400 uppercase font-mono">
              <tr>
                <th className="px-6 py-4">Title & Type</th>
                <th className="px-6 py-4">Issuer</th>
                <th className="px-6 py-4">Issued Date</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/60 text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : achievements.length > 0 ? (
                achievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-surface-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white max-w-xs truncate">{ach.title}</div>
                      <span className="text-[10px] font-mono text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                        {ach.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {ach.issuer ? ach.issuer.name : <span className="text-slate-500">—</span>}
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-400">
                      {ach.issued_date}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleVisibility(ach)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
                          ach.visibility === 'public'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : ach.visibility === 'unlisted'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                        title="Click to cycle visibility (public -> unlisted -> private)"
                      >
                        {ach.visibility}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(ach)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          ach.featured
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'text-slate-500 border-surface-700 hover:text-slate-300'
                        }`}
                        title="Toggle Featured Status"
                      >
                        <Star className={`w-4 h-4 ${ach.featured ? 'fill-amber-300' : ''}`} />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/achievements/${ach.slug}`}
                          className="p-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-400 hover:text-brand-300 hover:bg-surface-700"
                          title="View Public Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/achievements/${ach.id}/edit`}
                          className="p-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-400 hover:text-white hover:bg-surface-700"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(ach.id, ach.title)}
                          className="p-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-400 hover:text-rose-400 hover:bg-surface-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No achievements created yet. Click "Add New Achievement" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Generate Share Pack Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Share2 className="w-5 h-5 text-brand-400" />
              <span>Generate Recruiter Share Pack</span>
            </div>

            {!createdPackResult ? (
              <form onSubmit={handleGeneratePack} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">Paste Job Description (JD)</label>
                  <textarea
                    rows={5}
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste job title, responsibilities, or requirements text here..."
                    className="w-full bg-surface-900 border border-surface-700 text-white rounded-xl p-3 focus:outline-none focus:border-brand-500 font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">Expiration Duration</label>
                  <select
                    value={expiresHours}
                    onChange={(e) => setExpiresHours(Number(e.target.value))}
                    className="w-full bg-surface-900 border border-surface-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
                  >
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours</option>
                    <option value={72}>72 Hours (3 Days)</option>
                    <option value={168}>7 Days (1 Week)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-surface-900 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold disabled:opacity-50"
                  >
                    {isGenerating ? 'Filtering Evidence...' : 'Create & Copy Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl space-y-1">
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Evidence Pack Generated!</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 font-sans">
                    Link auto-copied to clipboard. Share with recruiters for role-specific access.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">Share Link</span>
                  <div className="p-3 bg-surface-950 border border-surface-700 text-brand-300 rounded-xl truncate">
                    {createdPackResult.fullUrl}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdPackResult.fullUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold flex items-center gap-2"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link Again'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
