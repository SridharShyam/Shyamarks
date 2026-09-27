import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, Trash2, Edit2, AlertCircle, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';

export const AdminIssuersPage = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [editingIssuer, setEditingIssuer] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: issuers, isLoading } = useQuery({
    queryKey: ['admin-issuers-manage'],
    queryFn: () => api.getIssuers(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingIssuer ? api.updateIssuer(editingIssuer.id, data) : api.createIssuer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-issuers-manage'] });
      resetForm();
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to save issuer');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteIssuer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-issuers-manage'] });
    },
  });

  const resetForm = () => {
    setName('');
    setWebsite('');
    setLogoUrl('');
    setEditingIssuer(null);
    setErrorMsg('');
  };

  const handleEditClick = (issuer) => {
    setEditingIssuer(issuer);
    setName(issuer.name);
    setWebsite(issuer.website || '');
    setLogoUrl(issuer.logo_url || '');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Issuer Name is required.');
      return;
    }
    saveMutation.mutate({
      name,
      website: website || undefined,
      logo_url: logoUrl || undefined,
    });
  };

  const inputStyles = "w-full bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-accent text-xs transition-colors";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Form Sidebar */}
      <div className="space-y-6">
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-accent" />
            {editingIssuer ? 'Edit Issuer' : 'Create New Issuer'}
          </h2>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-text-primary">Issuer / Organization Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amazon Web Services, Coursera"
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-text-primary">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-text-primary">Logo Image URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className={inputStyles}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              {editingIssuer && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-1/2 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-card text-text-muted hover:text-text-primary font-semibold border border-border"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:brightness-110 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                <Plus className="w-4 h-4" />
                <span>{editingIssuer ? 'Update Issuer' : 'Create Issuer'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Table */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-surface-800/80 border border-surface-700/80 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-900/80 border-b border-surface-700 text-slate-400 uppercase font-mono">
              <tr>
                <th className="px-6 py-4">Issuer Name</th>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/60 text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    Loading issuers...
                  </td>
                </tr>
              ) : issuers && issuers.length > 0 ? (
                issuers.map((issuer) => (
                  <tr key={issuer.id} className="hover:bg-surface-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{issuer.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {issuer.website ? (
                        <a
                          href={issuer.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{issuer.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(issuer)}
                          className="p-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete issuer "${issuer.name}"?`)) {
                              deleteMutation.mutate(issuer.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    No issuers recorded yet.
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
