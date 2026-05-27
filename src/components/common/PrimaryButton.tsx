import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export default function PrimaryButton({ children, className = '', loading, disabled, ...props }: Props) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`w-full bg-primary text-white text-app-button h-14 rounded-full shadow-soft flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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