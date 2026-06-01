import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import BottomNav from './BottomNav';
import Toast from '../common/Toast';
import BottomSheet from '../common/BottomSheet';
import PullToRefresh from '../common/PullToRefresh';
import { useBenefitStore } from '../../store/useBenefitStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAiRecommendationStore } from '../../store/useAiRecommendationStore';

export default function MobileShell() {
  const location = useLocation();
  const element = useOutlet();
  
  const tabRoutes = ['/', '/benefits', '/board', '/schedule', '/mypage'];
  const isTabRoute = tabRoutes.includes(location.pathname);

  useEffect(() => {
    // Scroll restoration for app-like feeling
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleRefresh = async () => {
    const path = location.pathname;
    try {
      if (path === '/') {
        await Promise.all([
          useBenefitStore.getState().fetchRecommendedBenefits(),
          useBenefitStore.getState().fetchSavedBenefits(),
          useAuthStore.getState().user ? useAiRecommendationStore.getState().fetchRecommendations() : Promise.resolve(),
        ]);
      } else if (path === '/benefits') {
        await useBenefitStore.getState().fetchBenefits({ page: 1, limit: 20, category: 'all', q: '' });
      } else if (path === '/board') {
        if (useAuthStore.getState().user) {
          await useBenefitStore.getState().fetchSavedBenefits();
        }
      } else if (path === '/schedule') {
        if (useAuthStore.getState().user) {
          await useBenefitStore.getState().fetchSavedBenefits();
        }
      } else if (path === '/mypage') {
        if (useAuthStore.getState().user) {
          await Promise.all([
            useBenefitStore.getState().fetchSavedBenefits(),
            useAiRecommendationStore.getState().fetchProfile(),
            useAuthStore.getState().fetchMe(),
          ]);
        }
      }
    } catch (error) {
      console.error('[PullToRefresh] Error refetching data:', error);
    }
  };

  return (
    <div className="relative mx-auto w-full md:max-w-[480px] min-h-dvh bg-[#F7F8FC] overflow-x-hidden font-sans md:shadow-[0_0_40px_rgba(0,0,0,0.08)]" style={{ marginTop: 0 }}>
      {isTabRoute ? (
        <>
          <main 
            className="min-h-dvh w-full max-w-full overflow-x-hidden scrollbar-hide"
            style={{
              paddingBottom: 'calc(68px + max(env(safe-area-inset-bottom), 12px) + 16px)',
            }}
          >
            <PullToRefresh onRefresh={handleRefresh}>
              <AnimatePresence mode="wait" initial={false}>
                {element && React.cloneElement(element, { key: location.pathname })}
              </AnimatePresence>
            </PullToRefresh>
          </main>
          <BottomNav />
        </>
      ) : (
        <main className="min-h-dvh w-full max-w-full overflow-x-hidden scrollbar-hide">
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
