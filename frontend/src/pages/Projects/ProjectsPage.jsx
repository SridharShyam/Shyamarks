import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderGit2 } from 'lucide-react';
import { api } from '../../services/api';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { usePageTitle } from '../../hooks/usePageTitle';

export const ProjectsPage = () => {
  usePageTitle('Projects');
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-page'],
    queryFn: () => api.getProjects(),
  });

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-heading text-h1 font-bold text-text-primary flex items-center gap-3">
          <FolderGit2 className="w-8 h-8 text-accent" />
          Projects & Code Evidence
        </h1>
        <p className="text-xs text-text-secondary mt-1 font-sans">
          Open-source software projects, repositories, and build artifacts validating practical skill application.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 glass-card rounded-2xl animate-pulse p-6"></div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-text-secondary text-sm font-sans">No projects published yet.</p>
        </div>
      )}
    </div>
  );
};
