import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderGit2, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AdminProjectsPage = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects-manage'],
    queryFn: () => api.getProjects(),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills-projects-manage'],
    queryFn: () => api.getSkills(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingProject ? api.updateProject(editingProject.id, data) : api.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects-manage'] });
      queryClient.invalidateQueries({ queryKey: ['projects-page'] });
      resetForm();
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to save project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects-manage'] });
      queryClient.invalidateQueries({ queryKey: ['projects-page'] });
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setGithubUrl('');
    setLiveUrl('');
    setTagsInput('');
    setSelectedSkillIds([]);
    setEditingProject(null);
    setErrorMsg('');
  };

  const handleEditClick = (proj) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setGithubUrl(proj.github_url || '');
    setLiveUrl(proj.live_url || '');
    setTagsInput(proj.tags ? proj.tags.join(', ') : '');
    setSelectedSkillIds(proj.skill_ids || []);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Project Title and Description are required.');
      return;
    }
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    saveMutation.mutate({
      title,
      description,
      github_url: githubUrl || undefined,
      live_url: liveUrl || undefined,
      tags,
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
            <FolderGit2 className="w-5 h-5 text-blue-400" />
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Shyamarks Engine"
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summary of tech stack, architecture & features..."
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl p-3 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">GitHub Repository URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Live Demo URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, fastapi, mongodb"
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Link Associated Skills</label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 bg-surface-900 rounded-xl border border-surface-700">
                {skills?.map((s) => {
                  const selected = selectedSkillIds.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-500'
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
              {editingProject && (
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
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Projects List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-surface-800/80 border border-surface-700/80 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-900/80 border-b border-surface-700 text-slate-400 uppercase font-mono">
              <tr>
                <th className="px-6 py-4">Title & Description</th>
                <th className="px-6 py-4">Links</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/60 text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    Loading projects...
                  </td>
                </tr>
              ) : projects && projects.length > 0 ? (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-surface-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white max-w-xs truncate">{proj.title}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{proj.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[11px]">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                            GitHub
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                            Live App
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(proj)}
                          className="p-1.5 rounded-lg bg-surface-900 border border-surface-700 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete project "${proj.title}"?`)) {
                              deleteMutation.mutate(proj.id);
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
                    No projects created yet.
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
