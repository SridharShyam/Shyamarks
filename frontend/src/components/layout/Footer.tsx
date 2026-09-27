import React from 'react';
import { ShieldCheck, Terminal, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-obsidian-750/60 light:border-slate-200 bg-obsidian-950/90 light:bg-slate-100 py-12 mt-20 text-slate-400 light:text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyanGlow-400 flex items-center justify-center text-white font-extrabold text-sm shadow-glow-cyan">
            S
          </div>
          <div>
            <p className="font-bold text-slate-200 light:text-slate-800 flex items-center gap-2">
              <span>Shyamarks</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Decision & Evidence Ledger
              </span>
            </p>
            <p className="text-[11px] text-slate-400 light:text-slate-500 mt-0.5">
              Shyamarks — Mark Every Milestone. Engineered by Shyam.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-slate-400 light:text-slate-600 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-brand-400" />
            FastAPI + MongoDB Atlas + React
          </span>
          <span>&copy; {new Date().getFullYear()} Shyamarks. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
