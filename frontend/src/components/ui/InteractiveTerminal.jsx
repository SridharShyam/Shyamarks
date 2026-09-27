import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, ShieldCheck, CornerDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Shyamarks AI Decision Engine v2.5.0-verified' },
    { type: 'output', text: 'Type "help" or "verify" to inspect verified credentials.' },
  ]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'input', text: `$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'Available CLI commands:\n  verify    - Run cryptographic audit of Shyam credentials\n  ccs       - Display Claim Confidence Score breakdown\n  export    - Output evidence dossier metadata\n  clear     - Clear terminal buffer',
        });
        break;
      case 'verify':
        newHistory.push({
          type: 'output',
          text: '⚡ Auditing Shyamarks evidence ledger...\n✓ 100% Cryptographic integrity verified.\n✓ 0 Unanchored claims detected.',
        });
        break;
      case 'ccs':
        newHistory.push({
          type: 'output',
          text: '📊 CCS Metric Summary:\n  Deep Learning: 92/100 (High Breadth)\n  FastAPI Backend: 88/100 (Verified)\n  MongoDB Atlas: 85/100 (Verified)\n  Agentic Systems: 95/100 (Verified)',
        });
        break;
      case 'export':
        newHistory.push({
          type: 'output',
          text: '📦 Preparing evidence brief export...\nMarkdown dossier ready for download.',
        });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHistory.push({
          type: 'output',
          text: `Command not recognized: "${cmd}". Type "help" for command directory.`,
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border shadow-2xl font-mono text-xs">
      {/* Terminal Titlebar */}
      <div className="bg-surface-elevated px-4 py-2.5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="text-[11px] text-text-muted font-bold ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-accent" />
            shyamarks-cli ~ evidence-verify
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          ACTIVE VERIFIER
        </span>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 bg-background min-h-[160px] max-h-[220px] overflow-y-auto space-y-2 text-text-primary">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={item.type === 'input' ? 'text-accent font-bold' : 'text-text-secondary whitespace-pre-line leading-relaxed'}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleCommand} className="border-t border-border bg-surface-elevated px-4 py-2 flex items-center gap-2">
        <span className="text-accent font-bold">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try 'verify', 'ccs', 'export', or 'help'..."
          className="flex-1 bg-transparent text-xs text-text-primary focus:outline-none placeholder:text-text-muted"
        />
        <button type="submit" className="text-text-muted hover:text-accent p-1 transition-colors">
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
