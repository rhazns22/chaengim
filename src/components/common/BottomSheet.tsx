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
            transition={{ duration: 0.2 }}
            onClick={closeSheet}
            className="fixed inset-0 z-[100] mx-auto w-full max-w-[430px] bg-textMain/40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 inset-x-0 z-[101] mx-auto w-full max-w-[430px] rounded-t-[44px] bg-white pb-safe"
          >
            <div className="flex w-full justify-center py-3">
              <div className="h-1.5 w-12 rounded-full bg-divider" />
            </div>
            <div className="max-h-[80vh] overflow-y-auto px-6 pb-8 pt-2">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}