import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

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
    <div className="min-h-screen bg-background text-text-primary flex transition-colors duration-300">
      {/* Collapsible Left Sidebar Layout */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 h-screen bg-surface border-r border-border flex flex-col justify-between shrink-0 z-40 overflow-hidden"
      >
        <div>
          {/* Studio Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-border">
            <Link to="/studio" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-heading font-bold text-sm shrink-0 shadow-accent-glow">
                S
              </div>
              {!collapsed && (
                <span className="font-heading font-extrabold text-text-primary text-sm whitespace-nowrap">
                  Studio <span className="text-accent text-xs font-mono font-normal">Console</span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {studioNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-accent text-white shadow-accent-glow'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors whitespace-nowrap"
            title="View Portfolio"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-accent" />
            {!collapsed && <span>Portfolio View</span>}
          </Link>

          {user && (
            <div className="flex items-center justify-between pt-2 border-t border-border px-1">
              {!collapsed && (
                <span className="font-mono text-[10px] text-text-muted truncate max-w-[140px]">
                  {user.email}
                </span>
              )}
              <button
                onClick={() => logout()}
                className="p-1.5 text-text-muted hover:text-error hover:bg-surface-elevated rounded-lg transition-colors"
                title="Logout Studio Console"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Studio Work Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
