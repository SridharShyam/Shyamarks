import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { Achievement, VisibilityType } from '../../types';

export const AdminAchievementsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: achievementsRes, isLoading } = useQuery({
    queryKey: ['admin-achievements-list'],
    queryFn: () => api.getAchievements({ limit: 1000 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Achievement> }) =>
      api.updateAchievement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-all'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-achievements-all'] });
    },
  });

  const achievements = achievementsRes?.items || [];

  const handleToggleVisibility = (ach: Achievement) => {
    const nextVisibility: Record<VisibilityType, VisibilityType> = {
      public: 'unlisted',
      unlisted: 'private',
      private: 'public',
    };
    updateMutation.mutate({
      id: ach.id,
      data: { visibility: nextVisibility[ach.visibility] },
    });
  };

  const handleToggleFeatured = (ach: Achievement) => {
    updateMutation.mutate({
      id: ach.id,
      data: { featured: !ach.featured },
    });
  };

  const handleDelete = (id: string, title: string) => {
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

        <Link
          to="/admin/achievements/new"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-600/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Achievement</span>
        </Link>
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
    </div>
  );
};
