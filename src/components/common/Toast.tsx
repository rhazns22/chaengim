import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../store/useToastStore';

export default function Toast() {
  const { isVisible, message } = useToastStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[380px] bg-textMain text-white text-[14px] font-bold px-6 py-4 rounded-[16px] shadow-float z-[100] text-center"
        >
          {typeof message === 'string' ? message : '오류가 발생했습니다.'}
        </motion.div>
      )}
    </AnimatePresence>
  );
}