import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ThemeProvider } from '../context/ThemeContext';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export const PublicLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-obsidian-950 light:bg-slate-50 text-slate-100 light:text-slate-900 bg-glow-radial transition-colors duration-300 relative overflow-x-hidden">
        <AnimatedBackground />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};
