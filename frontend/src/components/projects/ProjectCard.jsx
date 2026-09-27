import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ExternalLink, Github, Globe } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card-hover rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden border border-border group"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-indigo-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div>
        {/* Header Icon + Title */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0 shadow-accent-glow">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-h3 font-bold text-text-primary group-hover:text-accent transition-colors">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3 font-sans">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-surface-elevated text-text-secondary border border-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* External Links */}
      <div className="pt-4 border-t border-border flex items-center gap-3">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-text-primary bg-surface-elevated hover:bg-surface border border-border transition-all hover:scale-105"
          >
            <Github className="w-4 h-4 text-accent" />
            <span>GitHub Repository</span>
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-accent shadow-accent-glow hover:brightness-110 transition-all hover:scale-105"
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
