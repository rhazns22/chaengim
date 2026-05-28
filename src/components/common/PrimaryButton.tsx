import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export default function PrimaryButton({ children, className = '', loading, disabled, ...props }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileTap={{ scale: disabled || loading || shouldReduceMotion ? 1 : 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={`flex h-14 w-full items-center justify-center rounded-full bg-primary text-app-button text-white shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props as any}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </motion.button>
  );
}