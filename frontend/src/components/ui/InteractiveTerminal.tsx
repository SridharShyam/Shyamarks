import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, CheckCircle, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = [
  {
    cmd: 'shyamarks verify --id=AWS-84291',
    out: '[OK] Cryptographic Signature Verified (Issuer: AWS • Status: PUBLIC)',
    badge: '100% VALID',
  },
  {
    cmd: 'shyamarks ccs --skill="FastAPI"',
    out: '[SCORE] Claim Confidence Score: 95/100 (Certs: 4 | Projects: 3 | Recency: <6mo)',
    badge: 'CCS VERIFIED',
  },
  {
    cmd: 'shyamarks status',
    out: '[ONLINE] Shyamarks Ledger Engine v1.0 • Single-User Curator Mode (Shyam)',
    badge: 'ENGINE LIVE',
  }
];

export const InteractiveTerminal: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % COMMANDS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = COMMANDS[index];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-obsidian-900/90 light:bg-slate-900 border border-obsidian-750 light:border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-slate-200 backdrop-blur-xl">
      {/* Terminal Titlebar */}
      <div className="bg-obsidian-950/80 px-4 py-3 flex items-center justify-between border-b border-obsidian-750/70">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="text-[11px] text-slate-400 font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-400" />
            shyamarks-cli v1.0.0 — bash
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-obsidian-850 border border-obsidian-750"
          title="Copy command line text"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Terminal Display Content */}
      <div className="p-5 space-y-3 min-h-[110px] flex flex-col justify-center">
        <div className="flex items-center gap-2 text-brand-400">
          <span className="text-emerald-400 font-bold">$</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={current.cmd}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-slate-100"
            >
              {current.cmd}
            </motion.span>
          </AnimatePresence>
          <span className="w-2 h-4 bg-brand-400 animate-pulse"></span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.out}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-start justify-between gap-3 text-slate-300 text-[11px]"
          >
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{current.out}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30 shrink-0">
              {current.badge}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
