import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Award, Layers, FolderGit2, Compass, Calendar, ArrowRight, X } from 'lucide-react';
import { api } from '../../services/api';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Listen for Cmd+K or Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data: achievementsRes } = useQuery({
    queryKey: ['command-palette-achievements'],
    queryFn: () => api.getAchievements({ limit: 100 }),
    enabled: isOpen,
  });

  const { data: skills } = useQuery({
    queryKey: ['command-palette-skills'],
    queryFn: () => api.getSkills(),
    enabled: isOpen,
  });

  const { data: projects } = useQuery({
    queryKey: ['command-palette-projects'],
    queryFn: () => api.getProjects(),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const achievements = achievementsRes?.items || [];
  const q = query.toLowerCase().trim();

  const filteredAchievements = achievements
    .filter((a) => a.title.toLowerCase().includes(q) || a.type.toLowerCase().includes(q))
    .slice(0, 5);

  const filteredSkills = (skills || [])
    .filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
    .slice(0, 5);

  const filteredProjects = (projects || [])
    .filter((p) => p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))
    .slice(0, 5);

  const pages = [
    { title: 'Achievements Ledger', path: '/achievements', icon: Award },
    { title: 'Skills & CCS Index', path: '/skills', icon: Layers },
    { title: 'Projects Portfolio', path: '/projects', icon: FolderGit2 },
    { title: 'Learning Paths', path: '/learning-paths', icon: Compass },
    { title: 'Timeline & Heatmap', path: '/timeline', icon: Calendar },
  ].filter((p) => p.title.toLowerCase().includes(q));

  const handleSelect = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-surface-800 border border-surface-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden space-y-0 relative">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-surface-700 bg-surface-900">
          <Search className="w-5 h-5 text-accent shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search achievements, skills, or projects... (Esc to close)"
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-sans"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 font-sans text-xs">
          {/* Quick Pages */}
          {pages.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2">
                Navigation Shortcuts
              </span>
              {pages.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.path}
                    onClick={() => handleSelect(p.path)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-700/60 cursor-pointer text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-accent" />
                      <span className="font-semibold">{p.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Achievements Matches */}
          {filteredAchievements.length > 0 && (
            <div className="space-y-1 border-t border-surface-700/60 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2">
                Achievements ({filteredAchievements.length})
              </span>
              {filteredAchievements.map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleSelect(`/achievements/${a.slug}`)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-700/60 cursor-pointer text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-medium truncate">{a.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 shrink-0">
                    {a.type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Skills Matches */}
          {filteredSkills.length > 0 && (
            <div className="space-y-1 border-t border-surface-700/60 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2">
                Skills ({filteredSkills.length})
              </span>
              {filteredSkills.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelect('/skills')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-700/60 cursor-pointer text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-accent">CCS: {s.ccs ?? 0}</span>
                </div>
              ))}
            </div>
          )}

          {/* Projects Matches */}
          {filteredProjects.length > 0 && (
            <div className="space-y-1 border-t border-surface-700/60 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2">
                Projects ({filteredProjects.length})
              </span>
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleSelect('/projects')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-700/60 cursor-pointer text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderGit2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium truncate">{proj.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pages.length === 0 &&
            filteredAchievements.length === 0 &&
            filteredSkills.length === 0 &&
            filteredProjects.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching results for "{query}". Try another command or search term.
              </div>
            )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-surface-950 border-t border-surface-700 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>
            Navigation: <kbd className="bg-surface-800 px-1.5 py-0.5 rounded border border-surface-700">Cmd+K</kbd>
          </span>
          <span>Shyamarks Interactive Ledger</span>
        </div>
      </div>
    </div>
  );
};
