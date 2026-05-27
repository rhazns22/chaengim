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
    element: <MobileShell />,
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
