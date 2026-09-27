import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, Layers, FolderGit2, Calendar, ShieldCheck, LogOut, Sun, Moon, Terminal, Sliders } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Overview', icon: Terminal },
    { path: '/achievements', label: 'Achievements', icon: Award },
    { path: '/skills', label: 'Skills Index', icon: Layers },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/timeline', label: 'Timeline', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-obsidian-950/80 light:bg-white/80 backdrop-blur-xl border-b border-obsidian-750/60 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyanGlow-400 flex items-center justify-center text-white font-black text-lg shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-obsidian-950 rounded-full animate-pulse"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-100 light:text-slate-900 group-hover:text-brand-400 transition-colors">
                Shyamarks
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-brand-500/10 text-brand-300 border border-brand-500/30">
                AI / Evidence
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">
              Mark Every Milestone
            </span>
          </div>
        </Link>

        {/* Public Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-obsidian-900/60 light:bg-slate-100/80 p-1.5 rounded-full border border-obsidian-750/60 light:border-slate-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-brand-500 text-white shadow-glow-cyan'
                    : 'text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 hover:bg-obsidian-800/60 light:hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Switcher & Studio Console Access */}
        <div className="flex items-center gap-3">
          {/* Obsidian / Solar Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-mono bg-obsidian-850 light:bg-slate-200 border border-obsidian-750 light:border-slate-300 text-slate-300 light:text-slate-700 hover:border-brand-400/50 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Solar (Light)' : 'Obsidian (Dark)'} theme`}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden sm:inline">Obsidian</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Solar</span>
              </>
            )}
          </button>

          {/* Studio Console Navigation */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/studio"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-glow-cyan transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Studio</span>
              </Link>
              <button
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-obsidian-800 rounded-full transition-colors"
                title="Logout Studio"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/studio/login"
              className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-obsidian-850 light:hover:bg-slate-200"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Studio</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
