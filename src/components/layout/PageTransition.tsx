import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function PageTransition({ children, className = '', style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`w-full min-h-full ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}