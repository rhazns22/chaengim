import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../store/useToastStore';

export default function Toast() {
  const { isVisible, message } = useToastStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-28 inset-x-0 z-[200] mx-auto w-[calc(100%-48px)] max-w-[380px] rounded-[16px] bg-textMain px-6 py-4 text-center text-[14px] font-bold text-white shadow-float"
        >
          {typeof message === 'string' ? message : '오류가 발생했습니다.'}
        </motion.div>
      )}
    </AnimatePresence>
  );
}