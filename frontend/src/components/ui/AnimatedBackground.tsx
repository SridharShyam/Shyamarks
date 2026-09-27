import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>

      {/* Floating Glowing Orbs */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] bg-cyanGlow-500/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.25, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 left-10 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl"
      />
    </div>
  );
};
