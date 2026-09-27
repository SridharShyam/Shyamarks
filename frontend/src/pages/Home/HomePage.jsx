import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Layers,
  FolderGit2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Download,
  Calendar,
  Zap
} from 'lucide-react';
import { api } from '../../services/api';
import { AchievementCard } from '../../components/achievements/AchievementCard';
import { SkillCard } from '../../components/skills/SkillCard';
import { InteractiveTerminal } from '../../components/ui/InteractiveTerminal';
import { exportEvidenceDossier } from '../../utils/exportEvidence';
import { useCountUp } from '../../hooks/useCountUp';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { staggerContainer, fadeUp, scaleIn } from '../../lib/animations';

export const HomePage = () => {
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
  const totalAchievementsRaw = achievementsRes?.total || 0;
  const totalCertificationsRaw = achievements.filter((a) => a.type === 'Certification').length;
  const totalSkillsRaw = skills?.length || 0;
  const totalProjectsRaw = projects?.length || 0;

  const totalAchievements = useCountUp(totalAchievementsRaw, 1500, true);
  const totalCertifications = useCountUp(totalCertificationsRaw, 1500, true);
  const totalSkills = useCountUp(totalSkillsRaw, 1500, true);
  const totalProjects = useCountUp(totalProjectsRaw, 1500, true);

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
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Status Pill */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-semibold shadow-accent-glow">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available for AI / ML Roles & Evidence Verification</span>
            </motion.div>

            {/* Staggered Hero Title */}
            <motion.h1 variants={fadeUp} className="font-heading text-hero text-text-primary leading-tight">
              Engineering intelligent systems that turn{' '}
              <span className="bg-gradient-to-r from-accent via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                raw data into decisive action.
              </span>
            </motion.h1>

            {/* Subheading Taglines */}
            <motion.div variants={fadeUp} className="space-y-2 border-l-2 border-accent/50 pl-4">
              <p className="font-heading text-h3 font-bold text-text-primary flex items-center gap-2">
                <span>Shyamarks — Mark Every Milestone.</span>
                <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
              </p>
              <p className="text-xs text-text-secondary font-medium">
                Your achievements. Your evidence. Your journey.
              </p>
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed font-sans">
              A structured personal achievement & credential evidence management platform designed by <strong>Shyam</strong>. Quantifies skill mastery through dynamic Claim Confidence Scores (CCS), archives verified certificates, and traces continuous professional growth.
            </motion.p>

            {/* Hero CTA Buttons */}
            <motion.div variants={fadeUp} className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/achievements"
                className="px-6 py-3.5 rounded-2xl bg-accent text-white font-semibold text-xs shadow-accent-glow flex items-center gap-2.5 group transition-all hover:scale-105"
              >
                <span>Explore Achievement Ledger</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleExportDossier}
                className="px-5 py-3.5 rounded-2xl bg-surface-elevated hover:bg-surface border border-border text-text-primary font-semibold text-xs transition-all flex items-center gap-2 hover:scale-105"
                title="Download full Markdown evidence dossier"
              >
                <Download className="w-4 h-4 text-accent" />
                <span>Export Evidence Brief</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Shyam Profile Card & Interactive CLI Terminal */}
          <motion.div variants={fadeUp} className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden group border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-indigo-500 p-0.5 shadow-accent-glow shrink-0 animate-float">
                  <div className="w-full h-full bg-surface rounded-[14px] flex items-center justify-center text-text-primary font-heading font-black text-2xl">
                    S
                  </div>
                </div>
                <div>
                  <h3 className="font-heading text-h3 font-bold text-text-primary">
                    Shyam
                  </h3>
                  <p className="text-xs font-semibold text-accent font-mono mt-0.5">
                    AI Engineer & Data Scientist
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Decision Support Systems • MLOps • Agentic AI
                  </p>
                </div>
              </div>

              {/* Core Competencies Tags */}
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-label text-text-muted">Core Technical DNA</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Deep Learning', 'Predictive ML', 'Agentic AI', 'FastAPI', 'MongoDB Atlas', 'PyTorch'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-surface-elevated text-text-secondary border border-border hover:border-accent/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Interactive CLI Terminal */}
            <InteractiveTerminal />
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Bar with Count-Up animation */}
      <RevealOnScroll className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -4 }} className="glass-card-hover rounded-2xl p-6 flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0 shadow-accent-glow">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-text-primary">{totalAchievements}</div>
              <div className="text-xs text-text-secondary font-medium">Total Milestones</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-card-hover rounded-2xl p-6 flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-text-primary">{totalCertifications}</div>
              <div className="text-xs text-text-secondary font-medium">Certifications</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-card-hover rounded-2xl p-6 flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-text-primary">{totalSkills}</div>
              <div className="text-xs text-text-secondary font-medium">Verified Skills</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-card-hover rounded-2xl p-6 flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-accent shrink-0 shadow-accent-glow">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-text-primary">{totalProjects}</div>
              <div className="text-xs text-text-secondary font-medium">Projects</div>
            </div>
          </motion.div>
        </div>
      </RevealOnScroll>

      {/* Featured Achievements */}
      <RevealOnScroll className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-h2 font-bold text-text-primary flex items-center gap-2">
              <Award className="w-6 h-6 text-accent" />
              Featured Credentials & Proof
            </h2>
            <p className="text-xs text-text-secondary mt-1">Highlighted milestones backed by verified credentials</p>
          </div>
          <Link
            to="/achievements"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 font-mono"
          >
            <span>View All Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {displayFeatured.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {displayFeatured.map((ach) => (
              <motion.div key={ach.id} variants={fadeUp}>
                <AchievementCard achievement={ach} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center text-text-muted text-xs">
            No featured achievements listed yet.
          </div>
        )}
      </RevealOnScroll>

      {/* Top Skills by Claim Confidence Score (CCS) */}
      <RevealOnScroll className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-h2 font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Top Skills by Claim Confidence Score (CCS)
            </h2>
            <p className="text-xs text-text-secondary mt-1">Dynamic read-time score computed from evidence breadth & recency</p>
          </div>
          <Link
            to="/skills"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 font-mono"
          >
            <span>View All Skills Index</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topSkills.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {topSkills.map((skill) => (
              <motion.div key={skill.id} variants={scaleIn}>
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center text-text-muted text-xs">
            No skill metrics recorded yet.
          </div>
        )}
      </RevealOnScroll>

      {/* Timeline Stream Preview */}
      <RevealOnScroll className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-h2 font-bold text-text-primary flex items-center gap-2">
              <Calendar className="w-6 h-6 text-accent" />
              Recent Milestone Stream
            </h2>
            <p className="text-xs text-text-secondary mt-1">Chronological record of recent achievement milestones</p>
          </div>
          <Link
            to="/timeline"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 font-mono"
          >
            <span>Full Timeline & Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestMilestones.length > 0 ? (
          <div className="relative border-l-2 border-border ml-4 space-y-6">
            {latestMilestones.map((ach) => (
              <div key={ach.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-accent border-4 border-background shadow-accent-glow"></div>
                <div className="glass-card-hover rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded mr-2">
                      {ach.type}
                    </span>
                    <Link
                      to={`/achievements/${ach.slug}`}
                      className="font-heading font-bold text-text-primary hover:text-accent transition-colors"
                    >
                      {ach.title}
                    </Link>
                    {ach.issuer && (
                      <span className="text-xs text-text-secondary ml-2">via {ach.issuer.name}</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-text-muted shrink-0">{ach.issued_date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-text-muted text-xs">
            No recent milestones.
          </div>
        )}
      </RevealOnScroll>
    </div>
  );
};
