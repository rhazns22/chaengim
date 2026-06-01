import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '../components/common/AppLogo';
import { useAuthStore } from '../store/useAuthStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';

export default function SplashPage() {
  const navigate = useNavigate();
  const { accessToken, isGuest, logout } = useAuthStore();
  const { fetchProfile } = useAiRecommendationStore();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const performBootstrap = async () => {
      // 1. 최소 1200ms 동안 스플래시 대기
      const splashDelay = new Promise((resolve) => setTimeout(resolve, 1400));
      
      // 2. 백그라운드에서 Auth/Profile 확인 연산 진행
      const routingDecision = async (): Promise<string> => {
        if (isGuest) {
          return '/';
        }
        if (!accessToken) {
          return '/login';
        }

        try {
          // 1. JWT 토큰을 기반으로 사용자 정보(me)를 백그라운드에서 조회하여 복원/인증 검사
          await useAuthStore.getState().fetchMe();
          
          // 만약 토큰이 유효하지 않아 fetchMe 호출 도중 accessToken이 날아갔거나 user가 없으면 로그인 유도
          const currentUserStore = useAuthStore.getState();
          if (!currentUserStore.accessToken || !currentUserStore.user) {
            return '/login';
          }

          // 2. 프로필 가져오기
          await fetchProfile();
          
          // 스토어 갱신된 최신 state로 검사
          const currentStore = useAiRecommendationStore.getState();
          
          if (currentStore.error && currentStore.error.includes('401')) {
            logout();
            return '/login';
          }

          if (currentStore.needsProfileSetup || !currentStore.profile) {
            return '/profile-setup';
          }
          
          return '/';
        } catch (err) {
          console.error(err);
          // 에러 발생 혹은 세션 만료 시 로그인 페이지로 안전 라우팅
          return '/login';
        }
      };

      // 병렬 대기 처리
      const [_, targetPath] = await Promise.all([splashDelay, routingDecision()]);

      if (active) {
        // 자연스러운 fade-out 전환
        setIsFadingOut(true);
        setTimeout(() => {
          if (active) {
            navigate(targetPath, { replace: true });
          }
        }, 300);
      }
    };

    performBootstrap();

    // 네트워크 지연으로 인한 무한 멈춤 현상(3초 상한선) 방지 세이프티 가드
    const safetyGuard = setTimeout(() => {
      if (active) {
        setIsFadingOut(true);
        setTimeout(() => {
          if (active) {
            if (accessToken) {
              navigate('/', { replace: true });
            } else {
              navigate('/login', { replace: true });
            }
          }
        }, 300);
      }
    }, 3200);

    return () => {
      active = false;
      clearTimeout(safetyGuard);
    };
  }, [accessToken, isGuest, fetchProfile, logout, navigate]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[999] flex w-full flex-col items-center justify-center bg-primary overflow-hidden"
        >
          {/* 중앙 로고 & 타이틀 그룹 */}
          <div className="flex flex-col items-center select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-[96px] w-[96px] items-center justify-center rounded-[28px] bg-white/16 backdrop-blur shadow-lg"
            >
              <AppLogo white size="lg" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[32px] font-extrabold tracking-tight text-white"
            >
              챙김
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 text-[14px] font-semibold text-white/80"
            >
              내게 맞는 정부 혜택을 한눈에
            </motion.p>
          </div>

          <div 
            className="absolute flex gap-1.5 justify-center items-center"
            style={{ bottom: 'calc(48px + var(--safe-bottom))' }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="h-2.5 w-2.5 rounded-full bg-white/40"
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.18
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}