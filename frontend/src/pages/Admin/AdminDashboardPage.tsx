import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Award,
  Layers,
  FolderGit2,
  Briefcase,
  Building2,
  Plus,
  Eye,
  EyeOff,
  Globe,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const { data: achievementsRes } = useQuery({
    queryKey: ['admin-achievements-all'],
    queryFn: () => api.getAchievements({ limit: 1000 }),
  });

  const { data: skills } = useQuery({
    queryKey: ['admin-skills-all'],
    queryFn: () => api.getSkills(),
  });

  const { data: projects } = useQuery({
    queryKey: ['admin-projects-all'],
    queryFn: () => api.getProjects(),
  });

  const { data: experiences } = useQuery({
    queryKey: ['admin-experiences-all'],
    queryFn: () => api.getExperiences(),
  });

  const { data: issuers } = useQuery({
    queryKey: ['admin-issuers-all'],
    queryFn: () => api.getIssuers(),
  });

  const achievements = achievementsRes?.items || [];
  const totalAchievements = achievementsRes?.total || 0;

  // Visibility breakdown
  const publicCount = achievements.filter((a) => a.visibility === 'public').length;
  const unlistedCount = achievements.filter((a) => a.visibility === 'unlisted').length;
  const privateCount = achievements.filter((a) => a.visibility === 'private').length;

  // Type breakdown
  const typeCounts: Record<string, number> = {};
  achievements.forEach((a) => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-brand-400" />
            Admin Dashboard Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            System stats, visibility metrics, and entity management controls.
          </p>
        </div>

        <Link
          to="/admin/achievements/new"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-600/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Achievement</span>
        </Link>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link to="/admin/achievements" className="bg-surface-800/80 border border-surface-700/80 hover:border-brand-500/50 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Achievements</span>
            <Award className="w-5 h-5 text-brand-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">{totalAchievements}</div>
          <div className="text-[11px] text-brand-400 mt-1">Manage All &rarr;</div>
        </Link>

        <Link to="/admin/skills" className="bg-surface-800/80 border border-surface-700/80 hover:border-brand-500/50 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Skills</span>
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">{skills?.length || 0}</div>
          <div className="text-[11px] text-purple-400 mt-1">Manage Skills &rarr;</div>
        </Link>

        <Link to="/admin/projects" className="bg-surface-800/80 border border-surface-700/80 hover:border-brand-500/50 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Projects</span>
            <FolderGit2 className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">{projects?.length || 0}</div>
          <div className="text-[11px] text-blue-400 mt-1">Manage Projects &rarr;</div>
        </Link>

        <Link to="/admin/experiences" className="bg-surface-800/80 border border-surface-700/80 hover:border-brand-500/50 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Experiences</span>
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">{experiences?.length || 0}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Manage Experiences &rarr;</div>
        </Link>

        <Link to="/admin/issuers" className="bg-surface-800/80 border border-surface-700/80 hover:border-brand-500/50 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Issuers</span>
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">{issuers?.length || 0}</div>
          <div className="text-[11px] text-amber-400 mt-1">Manage Issuers &rarr;</div>
        </Link>
      </div>

      {/* Breakdown Grid: Visibility & Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visibility Stats */}
        <div className="bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-400" />
            Achievements by Visibility State
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-900 border border-surface-700 p-4 rounded-xl text-center">
              <span className="text-xs text-emerald-400 font-semibold block">Public</span>
              <span className="text-2xl font-black font-mono text-white mt-1 block">{publicCount}</span>
            </div>
            <div className="bg-surface-900 border border-surface-700 p-4 rounded-xl text-center">
              <span className="text-xs text-amber-400 font-semibold block">Unlisted</span>
              <span className="text-2xl font-black font-mono text-white mt-1 block">{unlistedCount}</span>
            </div>
            <div className="bg-surface-900 border border-surface-700 p-4 rounded-xl text-center">
              <span className="text-xs text-rose-400 font-semibold block">Private</span>
              <span className="text-2xl font-black font-mono text-white mt-1 block">{privateCount}</span>
            </div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-purple-400" />
            Achievements by Type
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between bg-surface-900 border border-surface-700 px-3 py-2 rounded-lg">
                <span className="text-slate-300 font-medium truncate">{type}</span>
                <span className="font-mono font-bold text-brand-400">{count}</span>
              </div>
            ))}
            {Object.keys(typeCounts).length === 0 && (
              <p className="text-xs text-slate-500 col-span-3">No achievement records yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
