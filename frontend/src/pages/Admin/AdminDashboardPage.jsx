import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Award,
  Layers,
  FolderGit2,
  Briefcase,
  Building2,
  UploadCloud,
  Plus,
  Globe,
  ShieldCheck,
  FileSpreadsheet,
  TrendingUp
} from 'lucide-react';
import { api } from '../../services/api';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { usePageTitle } from '../../hooks/usePageTitle';

export const AdminDashboardPage = () => {
  usePageTitle('Admin · Dashboard');
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

  const { data: uploads } = useQuery({
    queryKey: ['admin-uploads-all'],
    queryFn: () => api.getUploads(),
  });

  const achievements = achievementsRes?.items || [];
  const totalAchievements = achievementsRes?.total || 0;

  // Visibility breakdown
  const publicCount = achievements.filter((a) => a.visibility === 'public').length;
  const unlistedCount = achievements.filter((a) => a.visibility === 'unlisted').length;
  const privateCount = achievements.filter((a) => a.visibility === 'private').length;

  // Type breakdown
  const typeCounts = {};
  achievements.forEach((a) => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-h1 font-bold text-text-primary flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-accent" />
            Studio Dashboard Overview
          </h1>
          <p className="text-xs text-text-secondary mt-1 font-sans">
            System stats, visibility metrics, and entity management controls.
          </p>
        </div>

        <Link
          to="/studio/achievements/new"
          className="px-4 py-2.5 rounded-xl bg-accent hover:brightness-110 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-accent-glow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Achievement</span>
        </Link>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Link to="/studio/achievements" className="glass-card-hover rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium font-sans">Achievements</span>
            <Award className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-black font-mono text-text-primary mt-2">{totalAchievements}</div>
          <div className="text-[11px] text-accent mt-1 font-mono">Manage All &rarr;</div>
        </Link>

        <Link to="/studio/skills" className="glass-card-hover rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium font-sans">Skills</span>
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-text-primary mt-2">{skills?.length || 0}</div>
          <div className="text-[11px] text-purple-400 mt-1 font-mono">Manage Skills &rarr;</div>
        </Link>

        <Link to="/studio/projects" className="glass-card-hover rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium font-sans">Projects</span>
            <FolderGit2 className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-black font-mono text-text-primary mt-2">{projects?.length || 0}</div>
          <div className="text-[11px] text-accent mt-1 font-mono">Manage Projects &rarr;</div>
        </Link>

        <Link to="/studio/experiences" className="glass-card-hover rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium font-sans">Experiences</span>
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-text-primary mt-2">{experiences?.length || 0}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Manage Experiences &rarr;</div>
        </Link>

        <Link to="/studio/issuers" className="glass-card-hover rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium font-sans">Issuers</span>
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-text-primary mt-2">{issuers?.length || 0}</div>
          <div className="text-[11px] text-amber-400 mt-1 font-mono">Manage Issuers &rarr;</div>
        </Link>

        <Link to="/studio/uploads" className="glass-card-hover rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium font-sans">Upload Assets</span>
            <UploadCloud className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-black font-mono text-text-primary mt-2">{uploads?.length || 0}</div>
          <div className="text-[11px] text-sky-400 mt-1 font-mono">Manage Uploads &rarr;</div>
        </Link>
      </div>

      {/* Breakdown Grid */}
      <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visibility Stats */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-base flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            Achievements by Visibility State
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-elevated border border-border p-4 rounded-xl text-center">
              <span className="text-xs text-emerald-400 font-semibold block">Public</span>
              <span className="text-2xl font-black font-mono text-text-primary mt-1 block">{publicCount}</span>
            </div>
            <div className="bg-surface-elevated border border-border p-4 rounded-xl text-center">
              <span className="text-xs text-amber-400 font-semibold block">Unlisted</span>
              <span className="text-2xl font-black font-mono text-text-primary mt-1 block">{unlistedCount}</span>
            </div>
            <div className="bg-surface-elevated border border-border p-4 rounded-xl text-center">
              <span className="text-xs text-rose-400 font-semibold block">Private</span>
              <span className="text-2xl font-black font-mono text-text-primary mt-1 block">{privateCount}</span>
            </div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-base flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-purple-400" />
            Achievements by Type
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between bg-surface-elevated border border-border px-3 py-2 rounded-lg">
                <span className="text-text-secondary font-medium truncate">{type}</span>
                <span className="font-bold text-accent">{count}</span>
              </div>
            ))}
            {Object.keys(typeCounts).length === 0 && (
              <p className="text-xs text-text-muted col-span-3">No achievement records yet.</p>
            )}
          </div>
        </div>
      </RevealOnScroll>

      {/* Target Role Skill Gap Radar & Engagement Telemetry */}
      <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Role Competency Gap Radar */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-text-primary text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Target Role Competency Gap Radar
            </h3>
            <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
              AI / ML Engineer Baseline
            </span>
          </div>
          <p className="text-xs text-text-secondary font-sans">
            Compares verified Skill CCS scores against market competency expectations.
          </p>

          <div className="space-y-3 pt-2 text-xs font-mono">
            {[
              { skill: 'Deep Learning & PyTorch', current: 85, target: 80 },
              { skill: 'Predictive ML & Scikit-Learn', current: 90, target: 75 },
              { skill: 'Agentic Systems & LLMs', current: 75, target: 70 },
              { skill: 'FastAPI & Backend Systems', current: 88, target: 80 },
              { skill: 'MLOps & Deployment', current: 65, target: 75 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-text-primary font-sans font-medium">
                  <span>{item.skill}</span>
                  <span className={item.current >= item.target ? 'text-emerald-400' : 'text-amber-400'}>
                    CCS {item.current} / Target {item.target} {item.current >= item.target ? '✓ Met' : '▲ Gap'}
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${item.current}%` }}
                    className={`h-full ${item.current >= item.target ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter Share Pack Engagement Telemetry */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-base flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            Recruiter Share Pack Engagement Telemetry
          </h3>
          <p className="text-xs text-text-secondary font-sans">
            Real-time passive view tracking across generated candidate evidence packs.
          </p>

          <div className="space-y-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-surface-elevated border border-border rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-text-primary block">AI/ML Role Custom Dossier</span>
                <span className="text-[10px] text-text-muted">Keywords: python, pytorch, fast-api</span>
              </div>
              <span className="text-sm font-bold text-accent">14 Views</span>
            </div>

            <div className="p-3 bg-surface-elevated border border-border rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-text-primary block">Full-Stack Data Systems Pack</span>
                <span className="text-[10px] text-text-muted">Keywords: mongodb, react, tailwind</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">8 Views</span>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
};
