import { AnimatePresence, motion } from 'framer-motion';
import { useBottomSheetStore } from '../../store/useBottomSheetStore';
import { useEffect } from 'react';

export default function BottomSheet() {
  const { isOpen, content, closeSheet } = useBottomSheetStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSheet}
            className="fixed inset-0 bg-textMain/40 z-[100] max-w-[430px] mx-auto"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-[44px] z-[101] pb-safe"
          >
            <div className="w-full flex justify-center py-3">
              <div className="w-12 h-1.5 bg-divider rounded-full" />
            </div>
            <div className="px-6 pb-8 pt-2 max-h-[80vh] overflow-y-auto">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}