import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Ambient Light Orbs */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/30 blur-[100px]"
      />

      <motion.div
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 60, -30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-indigo-500/25 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-emerald-500/25 blur-[110px]"
      />

      {/* Cyber Grid SVG Overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-60"></div>
    </div>
  );
};
