import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderGit2 } from 'lucide-react';
import { api } from '../../services/api';
import { ProjectCard } from '../../components/projects/ProjectCard';

export const ProjectsPage: React.FC = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-page'],
    queryFn: () => api.getProjects(),
  });

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <FolderGit2 className="w-8 h-8 text-brand-400" />
          Projects & Code Evidence
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Open-source software projects, repositories, and build artifacts validating practical skill application.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 bg-surface-800/40 border border-surface-700/60 rounded-2xl animate-pulse p-6"></div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-800/40 border border-surface-700/60 rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-sm">No projects published yet.</p>
        </div>
      )}
    </div>
  );
};
