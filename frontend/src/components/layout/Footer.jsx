import React from 'react';
import { Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-surface py-12 mt-20 text-text-secondary text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-heading font-extrabold text-sm shadow-accent-glow">
            S
          </div>
          <div>
            <p className="font-heading font-bold text-text-primary flex items-center gap-2">
              <span>Shyamarks</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                Decision & Evidence Ledger
              </span>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5 font-sans">
              Shyamarks — Mark Every Milestone. Engineered by Shyam.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-text-muted text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-accent" />
            FastAPI + MongoDB Atlas + React JS
          </span>
          <span>&copy; {new Date().getFullYear()} Shyamarks. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
