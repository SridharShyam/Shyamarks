import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Award,
  Layers,
  FolderGit2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Terminal,
  Download,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import { AchievementCard } from '../../components/achievements/AchievementCard';
import { SkillCard } from '../../components/skills/SkillCard';
import { exportEvidenceDossier } from '../../utils/exportEvidence';

export const HomePage: React.FC = () => {
  const { data: achievementsRes } = useQuery({
    queryKey: ['achievements-home'],
    queryFn: () => api.getAchievements({ limit: 100 }),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills-home'],
    queryFn: () => api.getSkills(),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects-home'],
    queryFn: () => api.getProjects(),
  });

  const achievements = achievementsRes?.items || [];
  const totalAchievements = achievementsRes?.total || 0;
  const totalCertifications = achievements.filter((a) => a.type === 'Certification').length;
  const totalSkills = skills?.length || 0;
  const totalProjects = projects?.length || 0;

  const featuredAchievements = achievements.filter((a) => a.featured).slice(0, 3);
  const displayFeatured = featuredAchievements.length > 0 ? featuredAchievements : achievements.slice(0, 3);

  const topSkills = React.useMemo(() => {
    if (!skills) return [];
    return [...skills].sort((a, b) => (b.ccs || 0) - (a.ccs || 0)).slice(0, 6);
  }, [skills]);

  const latestMilestones = achievements.slice(0, 5);

  const handleExportDossier = () => {
    exportEvidenceDossier(achievements, skills || [], projects || []);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section matching Shyam's portfolio aesthetic */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono font-semibold shadow-glow-cyan">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available for AI / ML Roles & Evidence Verification</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 light:text-slate-900 leading-[1.1]">
              Engineering intelligent systems that turn{' '}
              <span className="bg-gradient-to-r from-brand-300 via-cyanGlow-400 to-emerald-300 bg-clip-text text-transparent">
                raw data into decisive action.
              </span>
            </h1>

            {/* Subheading Taglines */}
            <div className="space-y-2 border-l-2 border-brand-500/40 pl-4">
              <p className="text-lg font-bold text-slate-200 light:text-slate-800">
                Shyamarks — Mark Every Milestone.
              </p>
              <p className="text-sm text-slate-400 light:text-slate-600 font-medium">
                Your achievements. Your evidence. Your journey.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300/80 light:text-slate-600 max-w-xl leading-relaxed">
              A structured personal achievement & credential evidence management platform designed by <strong>Sridhar Shyam</strong>. Quantifies skill mastery through dynamic Claim Confidence Scores (CCS), archives verified certificates, and traces continuous professional growth.
            </p>

            {/* Hero CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/achievements"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-glow-cyan flex items-center gap-2 group transition-all"
              >
                <span>Explore Achievement Ledger</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleExportDossier}
                className="px-5 py-3 rounded-xl bg-obsidian-850 light:bg-slate-200 hover:bg-obsidian-800 border border-obsidian-750 light:border-slate-300 text-slate-200 light:text-slate-800 font-semibold text-xs transition-all flex items-center gap-2"
                title="Download full Markdown evidence dossier"
              >
                <Download className="w-4 h-4 text-brand-400" />
                <span>Export Evidence Brief</span>
              </button>
            </div>
          </div>

          {/* Right Column: Sridhar Shyam Interactive Profile Card */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyanGlow-400 p-0.5 shadow-glow-cyan shrink-0">
                  <div className="w-full h-full bg-obsidian-900 rounded-[14px] flex items-center justify-center text-white font-black text-2xl">
                    SS
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-100 light:text-slate-900">
                    Sridhar Shyam
                  </h3>
                  <p className="text-xs font-semibold text-brand-400 font-mono mt-0.5">
                    AI Engineer & Data Scientist
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Decision Support Systems • MLOps • Agentic AI
                  </p>
                </div>
              </div>

              {/* Core Competencies Tags */}
              <div className="space-y-2 pt-2 border-t border-obsidian-750/60 light:border-slate-200">
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Core Technical DNA</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Deep Learning', 'Predictive ML', 'Agentic AI', 'FastAPI', 'MongoDB Atlas', 'PyTorch'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-obsidian-900/80 light:bg-slate-200 text-slate-300 light:text-slate-700 border border-obsidian-750 light:border-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Status Bar */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="bg-obsidian-900/60 light:bg-slate-100 p-3 rounded-xl border border-obsidian-750/50 light:border-slate-200">
                  <span className="text-slate-400 text-[10px] block">VERIFICATION</span>
                  <span className="text-emerald-400 font-bold">100% Cryptographic</span>
                </div>
                <div className="bg-obsidian-900/60 light:bg-slate-100 p-3 rounded-xl border border-obsidian-750/50 light:border-slate-200">
                  <span className="text-slate-400 text-[10px] block">ENGINE</span>
                  <span className="text-brand-300 font-bold">Real-time CCS v1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar with Glowing Obsidian Cards */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card-hover rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-slate-100 light:text-slate-900">{totalAchievements}</div>
              <div className="text-xs text-slate-400 font-medium">Total Milestones</div>
            </div>
          </div>

          <div className="glass-card-hover rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-slate-100 light:text-slate-900">{totalCertifications}</div>
              <div className="text-xs text-slate-400 font-medium">Certifications</div>
            </div>
          </div>

          <div className="glass-card-hover rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-slate-100 light:text-slate-900">{totalSkills}</div>
              <div className="text-xs text-slate-400 font-medium">Verified Skills</div>
            </div>
          </div>

          <div className="glass-card-hover rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyanGlow-500/10 border border-cyanGlow-500/30 flex items-center justify-center text-cyanGlow-400 shrink-0">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-slate-100 light:text-slate-900">{totalProjects}</div>
              <div className="text-xs text-slate-400 font-medium">Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Achievements */}
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-brand-400" />
              Featured Credentials & Proof
            </h2>
            <p className="text-xs text-slate-400 mt-1">Highlighted milestones backed by verified credentials</p>
          </div>
          <Link
            to="/achievements"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 font-mono"
          >
            <span>View All Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {displayFeatured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayFeatured.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-xs">
            No featured achievements listed yet. Add items via the Studio Console.
          </div>
        )}
      </section>

      {/* Top Skills by Claim Confidence Score (CCS) */}
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Top Skills by Claim Confidence Score (CCS)
            </h2>
            <p className="text-xs text-slate-400 mt-1">Dynamic read-time score computed from evidence breadth & recency</p>
          </div>
          <Link
            to="/skills"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 font-mono"
          >
            <span>View All Skills Index</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-xs">
            No skill metrics recorded yet.
          </div>
        )}
      </section>

      {/* Timeline Stream Preview */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-brand-400" />
              Recent Milestone Stream
            </h2>
            <p className="text-xs text-slate-400 mt-1">Chronological record of recent achievement milestones</p>
          </div>
          <Link
            to="/timeline"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 font-mono"
          >
            <span>Full Timeline & Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestMilestones.length > 0 ? (
          <div className="relative border-l-2 border-obsidian-750/80 light:border-slate-300 ml-4 space-y-6">
            {latestMilestones.map((ach) => (
              <div key={ach.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-brand-500 border-4 border-obsidian-950 shadow-glow-cyan"></div>
                <div className="glass-card-hover rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded mr-2">
                      {ach.type}
                    </span>
                    <Link
                      to={`/achievements/${ach.slug}`}
                      className="font-bold text-slate-100 light:text-slate-900 hover:text-brand-300 transition-colors"
                    >
                      {ach.title}
                    </Link>
                    {ach.issuer && (
                      <span className="text-xs text-slate-400 ml-2">via {ach.issuer.name}</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 shrink-0">{ach.issued_date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-xs">
            No recent milestones.
          </div>
        )}
      </section>
    </div>
  );
};
