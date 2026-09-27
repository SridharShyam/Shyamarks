import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Award, Layers, Compass, FolderGit2, Calendar, Sun, Moon, Terminal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'Skills', path: '/skills', icon: Layers },
    { label: 'Paths', path: '/learning-paths', icon: Compass },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Timeline', path: '/timeline', icon: Calendar },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              SHYAMARKS
            </span>
            <span className="text-[10px] font-mono text-slate-400 -mt-1">Proof-of-Skill Ledger</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-600/90 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-all shadow-inner"
            title={`Switch to ${theme === 'dark' ? 'Solar / Light' : 'Obsidian / Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Studio Console Button */}
          <Link
            to="/studio"
            className="px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-200 border border-surface-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-lg group"
          >
            <Terminal className="w-3.5 h-3.5 text-brand-400 group-hover:animate-pulse" />
            <span>Studio Console</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
