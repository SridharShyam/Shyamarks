import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Award,
  Layers,
  FolderGit2,
  Briefcase,
  Building2,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/studio') return location.pathname === '/studio' || location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const studioNav = [
    { path: '/studio', label: 'Studio Dashboard', icon: LayoutDashboard },
    { path: '/studio/achievements', label: 'Achievements Curator', icon: Award },
    { path: '/studio/skills', label: 'Skills Index', icon: Layers },
    { path: '/studio/projects', label: 'Projects Manager', icon: FolderGit2 },
    { path: '/studio/experiences', label: 'Experience Roles', icon: Briefcase },
    { path: '/studio/issuers', label: 'Issuers Directory', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 light:bg-slate-50 text-slate-100 flex flex-col transition-colors duration-300">
      {/* Top Studio Header Bar */}
      <header className="sticky top-0 z-40 bg-obsidian-900/90 light:bg-white/90 border-b border-obsidian-750/80 light:border-slate-200 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/studio" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyanGlow-400 flex items-center justify-center text-white font-extrabold text-sm shadow-glow-cyan">
                S
              </div>
              <span className="font-extrabold text-slate-100 light:text-slate-900 tracking-tight text-base">
                Shyamarks <span className="text-brand-400 font-mono text-xs font-normal">/ Studio Console</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-600 hover:text-brand-300 font-medium px-3 py-1.5 rounded-lg hover:bg-obsidian-850 light:hover:bg-slate-200 transition-colors"
            >
              <span>View Portfolio View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {user && (
              <div className="flex items-center gap-3 border-l border-obsidian-750 light:border-slate-300 pl-4 text-xs">
                <span className="font-mono text-slate-300 light:text-slate-700 hidden sm:inline">{user.email}</span>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-obsidian-850 transition-colors"
                  title="Logout Studio"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Studio Sub-nav Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto border-t border-obsidian-800 light:border-slate-200 py-1.5">
          {studioNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? 'bg-brand-500 text-white shadow-glow-cyan'
                    : 'text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 hover:bg-obsidian-800/60 light:hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Studio Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Outlet />
      </main>
    </div>
  );
};
