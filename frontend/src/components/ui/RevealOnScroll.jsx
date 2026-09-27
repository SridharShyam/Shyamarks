import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/animations';

export const RevealOnScroll = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
