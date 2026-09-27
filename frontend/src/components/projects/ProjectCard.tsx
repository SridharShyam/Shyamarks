import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ExternalLink, Github, Globe } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card-hover rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden border border-obsidian-750 light:border-slate-200 group"
    >
      {/* Top Cyber Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyanGlow-400 via-brand-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div>
        {/* Header Icon + Title */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 shadow-glow-cyan">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-100 light:text-slate-900 group-hover:text-brand-300 transition-colors">
              {project.title}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300/90 light:text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-obsidian-900 light:bg-slate-100 text-slate-300 light:text-slate-700 border border-obsidian-750 light:border-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* External Links */}
      <div className="pt-4 border-t border-obsidian-750/60 light:border-slate-200 flex items-center gap-3">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-obsidian-900 light:bg-slate-200 hover:bg-obsidian-800 border border-obsidian-750 transition-all hover:scale-105"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-cyan transition-all hover:scale-105"
          >
            <Globe className="w-4 h-4" />
            <span>Live Project</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
};
