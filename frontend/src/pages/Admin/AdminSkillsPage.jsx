import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AdminSkillsPage = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: skills, isLoading } = useQuery({
    queryKey: ['admin-skills-manage'],
    queryFn: () => api.getSkills(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingSkill ? api.updateSkill(editingSkill.id, data) : api.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills-manage'] });
      queryClient.invalidateQueries({ queryKey: ['skills-page'] });
      resetForm();
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to save skill');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills-manage'] });
      queryClient.invalidateQueries({ queryKey: ['skills-page'] });
    },
  });

  const resetForm = () => {
    setName('');
    setCategory('');
    setDescription('');
    setEditingSkill(null);
    setErrorMsg('');
  };

  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setDescription(skill.description || '');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      setErrorMsg('Skill Name and Category are required.');
      return;
    }
    saveMutation.mutate({ name, category, description });
  };

  const handleDelete = (id, skillName) => {
    if (window.confirm(`Delete skill "${skillName}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const inputStyles = "w-full bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-accent text-xs transition-colors";
  const labelStyles = "font-semibold text-text-primary text-xs block mb-1";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Form Sidebar */}
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
            {editingSkill ? 'Edit Skill' : 'Create New Skill'}
          </h2>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className={labelStyles}>Skill Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Python, FastAPI, Docker"
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelStyles}>Category *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Backend, Cloud, DevOps"
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelStyles}>Description (Optional)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of domain expertise..."
                className={`${inputStyles} p-3`}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              {editingSkill && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-1/2 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface text-text-secondary font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:brightness-110 text-white font-semibold flex items-center justify-center gap-2 shadow-accent-glow"
              >
                <Plus className="w-4 h-4" />
                <span>{editingSkill ? 'Update Skill' : 'Create Skill'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Skills Table List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated border-b border-border text-text-muted uppercase font-mono">
              <tr>
                <th className="px-6 py-4">Skill Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">CCS Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    Loading skills...
                  </td>
                </tr>
              ) : skills && skills.length > 0 ? (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-text-primary">{skill.name}</div>
                      {skill.description && (
                        <p className="text-[11px] text-text-muted line-clamp-1">{skill.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-accent">
                      {skill.ccs ?? 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(skill)}
                          className="p-1.5 rounded-lg bg-surface-elevated border border-border text-text-secondary hover:text-text-primary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id, skill.name)}
                          className="p-1.5 rounded-lg bg-surface-elevated border border-border text-text-secondary hover:text-rose-400"
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
                    No skills created yet.
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
