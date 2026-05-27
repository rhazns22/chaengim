import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../components/common/AppLogo';
import PageTransition from '../components/layout/PageTransition';
import { useAuthStore } from '../store/useAuthStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';

export default function SplashPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const { fetchProfile } = useAiRecommendationStore();

  useEffect(() => {
    const checkAuthAndRoute = async () => {
      // 1. Minimum splash time 1.5s
      const splashDelay = new Promise(resolve => setTimeout(resolve, 1500));

      if (!accessToken) {
        await splashDelay;
        navigate('/login', { replace: true });
        return;
      }

      // 2. Has token -> check profile
      try {
        await fetchProfile();
        await splashDelay;
        const currentNeedsProfile = useAiRecommendationStore.getState().needsProfileSetup;
        if (currentNeedsProfile) {
          navigate('/profile-setup', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (err) {
        await splashDelay;
        navigate('/login', { replace: true });
      }
    };

    checkAuthAndRoute();
  }, [navigate, accessToken, fetchProfile]);

  return (
    <PageTransition className="w-full min-h-screen bg-primary flex flex-col items-center justify-center relative">
      <div className="flex flex-col items-center">
        <AppLogo white size="lg" className="mb-4" />
        <h1 className="text-[32px] font-extrabold text-white tracking-tight mb-2">챙김</h1>
        <p className="text-app-body font-semibold text-white/80">나를 위한 혜택 한눈에</p>
      </div>
    </PageTransition>
  );
}