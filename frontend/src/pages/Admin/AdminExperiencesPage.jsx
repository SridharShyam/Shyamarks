import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

const EXPERIENCE_TYPES = ['Internship', 'Research', 'Volunteer', 'Other'];

export const AdminExperiencesPage = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Internship');
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [editingExp, setEditingExp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['admin-experiences-manage'],
    queryFn: () => api.getExperiences(),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills-experiences-manage'],
    queryFn: () => api.getSkills(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingExp ? api.updateExperience(editingExp.id, data) : api.createExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences-manage'] });
      resetForm();
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to save experience');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences-manage'] });
    },
  });

  const resetForm = () => {
    setTitle('');
    setOrganization('');
    setRole('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setType('Internship');
    setSelectedSkillIds([]);
    setEditingExp(null);
    setErrorMsg('');
  };

  const handleEditClick = (exp) => {
    setEditingExp(exp);
    setTitle(exp.title);
    setOrganization(exp.organization);
    setRole(exp.role);
    setStartDate(exp.start_date);
    setEndDate(exp.end_date || '');
    setDescription(exp.description);
    setType(exp.type || 'Internship');
    setSelectedSkillIds(exp.skill_ids || []);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim() || !role.trim() || !startDate.trim() || !description.trim()) {
      setErrorMsg('Title, Organization, Role, Start Date, and Description are required.');
      return;
    }

    saveMutation.mutate({
      title,
      organization,
      role,
      start_date: startDate,
      end_date: endDate || undefined,
      description,
      type,
      skill_ids: selectedSkillIds,
    });
  };

  const toggleSkill = (idVal) => {
    if (selectedSkillIds.includes(idVal)) {
      setSelectedSkillIds(selectedSkillIds.filter((x) => x !== idVal));
    } else {
      setSelectedSkillIds([...selectedSkillIds, idVal]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Form Sidebar */}
      <div className="space-y-6">
        <div className="bg-surface-800/80 border border-surface-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            {editingExp ? 'Edit Experience' : 'Create New Experience'}
          </h2>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Title / Headline *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Organization *</label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Role *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Backend Developer"
                  className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Start Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-surface-900 border border-surface-700 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-surface-900 border border-surface-700 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-surface-900 border border-surface-700 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
              >
                {EXPERIENCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key responsibilities & accomplishments..."
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl p-3 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Link Associated Skills</label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-surface-900 rounded-xl border border-surface-700">
                {skills?.map((s) => {
                  const selected = selectedSkillIds.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        selected
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-surface-800 text-slate-400 border-surface-700 hover:text-slate-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {editingExp && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-1/2 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>{editingExp ? 'Update Experience' : 'Create Experience'}</span>
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
                <th className="px-6 py-4">Title & Org</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/60 text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Loading experiences...
                  </td>
                </tr>
              ) : experiences && experiences.length > 0 ? (
                experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-surface-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{exp.title}</div>
                      <div className="text-[11px] text-slate-400">{exp.organization} — {exp.role}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {exp.start_date} to {exp.end_date || 'Present'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {exp.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(exp)}
                          className="p-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete experience "${exp.title}"?`)) {
                              deleteMutation.mutate(exp.id);
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
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No experiences recorded yet.
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
