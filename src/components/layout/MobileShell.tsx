import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import BottomNav from './BottomNav';
import Toast from '../common/Toast';
import BottomSheet from '../common/BottomSheet';

export default function MobileShell() {
  const location = useLocation();
  const element = useOutlet();
  
  const tabRoutes = ['/', '/benefits', '/board', '/schedule', '/mypage'];
  const isTabRoute = tabRoutes.includes(location.pathname);

  useEffect(() => {
    // Scroll restoration for app-like feeling
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative mx-auto w-full md:max-w-[480px] min-h-dvh bg-[#F7F8FC] overflow-x-hidden font-sans md:shadow-[0_0_40px_rgba(0,0,0,0.08)]" style={{ marginTop: 0 }}>
      {isTabRoute ? (
        <>
          <main 
            className="min-h-dvh bg-white overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{ paddingBottom: 'calc(88px + var(--bottom-safe))' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {element && React.cloneElement(element, { key: location.pathname })}
            </AnimatePresence>
          </main>
          <BottomNav />
        </>
      ) : (
        <main className="min-h-dvh bg-white overflow-y-auto overflow-x-hidden scrollbar-hide">
          <AnimatePresence mode="wait" initial={false}>
            {element && React.cloneElement(element, { key: location.pathname })}
          </AnimatePresence>
        </main>
      )}
      <Toast />
      <BottomSheet />
    </div>
  );
}
