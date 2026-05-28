import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import SplashPage from '../pages/SplashPage';
import OnboardingPage from '../pages/OnboardingPage';
import RegisterTermsPage from '../pages/RegisterTermsPage';
import RegisterProfilePage from '../pages/RegisterProfilePage';
import RegisterVerifyPage from '../pages/RegisterVerifyPage';
import RegisterPasswordPage from '../pages/RegisterPasswordPage';
import RegisterCompletePage from '../pages/RegisterCompletePage';
import ProfileSetupPage from '../pages/ProfileSetupPage';
import { SkeletonCard } from '../components/common/Skeleton';
import { useAuthStore } from '../store/useAuthStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function AuthGuard() {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, isGuest } = useAuthStore();
  const { fetchProfile } = useAiRecommendationStore();

  useEffect(() => {
    let isMounted = true;
    const checkAuthAndRoute = async () => {
      // 1. Minimum splash time 1.5s only on first load
      const splashDelay = new Promise(resolve => setTimeout(resolve, 1500));

      const isAuthenticated = !!accessToken;

      if (!isAuthenticated && !isGuest) {
        await splashDelay;
        if (!isMounted) return;
        setIsReady(true);
        const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
        if (!isAuthRoute) {
          navigate('/login', { replace: true });
        }
        return;
      }

      if (isAuthenticated) {
        try {
          // If already ready, no need to fetch profile on every route change unless we are checking
          if (!isReady) {
            await fetchProfile();
          }
          await splashDelay;
          if (!isMounted) return;
          
          const hasCompletedProfile = !useAiRecommendationStore.getState().needsProfileSetup;
          setIsReady(true);

          if (!hasCompletedProfile) {
            if (location.pathname !== '/profile-setup') {
              navigate('/profile-setup', { replace: true });
            }
          } else {
            if (['/login', '/splash', '/register/complete'].includes(location.pathname)) {
              navigate('/', { replace: true });
            }
          }
        } catch (err) {
          await splashDelay;
          if (!isMounted) return;
          useAuthStore.getState().logout();
          setIsReady(true);
          navigate('/login', { replace: true });
        }
      } else {
        await splashDelay;
        if (!isMounted) return;
        setIsReady(true);
      }
    };

    checkAuthAndRoute();
    
    return () => { isMounted = false; };
  }, []); // Run only on mount

  // Handle logout separately
  useEffect(() => {
    if (isReady && !accessToken && !isGuest) {
      if (!location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')) {
        navigate('/login', { replace: true });
      }
    }
  }, [accessToken, isGuest, isReady, location.pathname, navigate]);

  if (!isReady) {
    return <SplashPage />;
  }

  return <MobileShell />;
}

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const BenefitsPage = lazy(() => import('../pages/BenefitsPage'));
const BenefitDetailPage = lazy(() => import('../pages/BenefitDetailPage'));
const BoardPage = lazy(() => import('../pages/BoardPage'));
const SchedulePage = lazy(() => import('../pages/SchedulePage'));
const MyPage = lazy(() => import('../pages/MyPage'));
const AccountSettingsPage = lazy(() => import('../pages/settings/AccountSettingsPage'));
const NoticesPage = lazy(() => import('../pages/settings/NoticesPage'));
const NoticeDetailPage = lazy(() => import('../pages/settings/NoticeDetailPage'));
const SettingsProfilePage = lazy(() => import('../pages/settings/SettingsProfilePage'));
const NotificationSettingsPage = lazy(() => import('../pages/settings/NotificationSettingsPage'));
const TermsPage = lazy(() => import('../pages/settings/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/settings/PrivacyPage'));
const AiGuidePage = lazy(() => import('../pages/settings/AiGuidePage'));
const WithdrawPage = lazy(() => import('../pages/settings/WithdrawPage'));
const AiRecommendationPage = lazy(() => import('../pages/AiRecommendationPage'));

function PageLoader() {
  return (
    <div className="min-h-[100dvh] bg-background p-6 pt-20">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

const lazyPage = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      { path: 'splash', element: <SplashPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'login', element: lazyPage(<LoginPage />) },
      { path: 'register', element: lazyPage(<RegisterPage />) },
      { path: 'register/terms', element: <RegisterTermsPage /> },
      { path: 'register/profile', element: <RegisterProfilePage /> },
      { path: 'register/verify', element: <RegisterVerifyPage /> },
      { path: 'register/password', element: <RegisterPasswordPage /> },
      { path: 'register/complete', element: <RegisterCompletePage /> },
      { index: true, element: lazyPage(<HomePage />) },
      { path: 'benefits', element: lazyPage(<BenefitsPage />) },
      { path: 'benefits/:id', element: lazyPage(<BenefitDetailPage />) },
      { path: 'board', element: lazyPage(<BoardPage />) },
      { path: 'schedule', element: lazyPage(<SchedulePage />) },
      { path: 'mypage', element: lazyPage(<MyPage />) },
      { path: 'settings/notifications', element: lazyPage(<NotificationSettingsPage />) },
      { path: 'settings/account', element: lazyPage(<AccountSettingsPage />) },
      { path: 'settings/profile', element: lazyPage(<SettingsProfilePage />) },
      { path: 'settings/notices', element: lazyPage(<NoticesPage />) },
      { path: 'settings/notices/:id', element: lazyPage(<NoticeDetailPage />) },
      { path: 'settings/terms', element: lazyPage(<TermsPage />) },
      { path: 'settings/privacy', element: lazyPage(<PrivacyPage />) },
      { path: 'settings/ai-guide', element: lazyPage(<AiGuidePage />) },
      { path: 'settings/withdraw', element: lazyPage(<WithdrawPage />) },
      { path: 'profile-setup', element: <ProfileSetupPage /> },
      { path: 'ai-recommendation', element: lazyPage(<AiRecommendationPage />) },
    ],
  },
]);
