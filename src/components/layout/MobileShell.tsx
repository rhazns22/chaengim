import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import BottomNav from './BottomNav';
import Toast from '../common/Toast';
import BottomSheet from '../common/BottomSheet';

export default function MobileShell() {
  const location = useLocation();
  const element = useOutlet();
  
  const hideNavPaths = ['/splash', '/onboarding', '/login', '/register', '/register/terms', '/register/profile', '/register/verify', '/register/password', '/register/complete', '/profile-setup'];
  const hideNavForDetail = location.pathname.startsWith('/benefits/');
  const showNav = !hideNavPaths.includes(location.pathname) && !hideNavForDetail;

  useEffect(() => {
    // Scroll restoration for app-like feeling
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative mx-auto w-full md:max-w-[480px] min-h-[100dvh] bg-[#F7F8FC] overflow-x-hidden font-sans md:shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <main className="min-h-[100dvh] bg-inherit">
        <AnimatePresence mode="wait" initial={false}>
          {element && React.cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
      </main>
      {showNav && <BottomNav />}
      <Toast />
      <BottomSheet />
    </div>
  );
}
