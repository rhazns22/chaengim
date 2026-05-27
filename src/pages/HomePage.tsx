import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBenefitStore } from '../store/useBenefitStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import AppLogo from '../components/common/AppLogo';
import BenefitIcon from '../components/common/BenefitIcon';
import heroIcon from '../assets/icons/hero-calendar-gift-check.png';
import PageTransition from '../components/layout/PageTransition';
import { SkeletonCard } from '../components/common/Skeleton';
import type { Benefit } from '../types/benefit';

export default function HomePage() {
  const { recommendedBenefits, deadlineSoonBenefits, savedBenefits, isLoading, fetchRecommendedBenefits, fetchSavedBenefits } = useBenefitStore();
  const { user } = useAuthStore();
  const { recommendations: aiRecommendations, fetchRecommendations } = useAiRecommendationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendedBenefits();
    fetchSavedBenefits();
    if (user) fetchRecommendations();
  }, [fetchRecommendedBenefits, fetchSavedBenefits, fetchRecommendations, user]);

  const homeRecommendations = aiRecommendations.length > 0
    ? aiRecommendations
      .map((recommendation) => recommendation.benefit)
      .filter((benefit): benefit is Benefit => Boolean(benefit))
      .slice(0, 3)
    : recommendedBenefits.slice(0, 3);

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] w-full flex-col bg-primary">
        <div className="relative h-[360px] px-6 pb-8 pt-14 text-white">
          <div className="mb-10 flex items-center gap-2">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[16px] bg-white/16">
              <AppLogo white size="md" />
            </div>
            <span className="text-[22px] font-extrabold tracking-tight text-white">챙김</span>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="mb-2 text-[15px] font-semibold text-white/85">
                {user ? `${user.name}님을 위한 챙김` : '나에게 맞는 혜택 챙김'}
              </p>
              <h1 className="break-keep text-[26px] font-extrabold leading-[1.3] text-white">
                놓치기 쉬운 혜택과<br />신청 일정을 한 번에
              </h1>
            </div>

            <div className="h-[104px] w-[104px] shrink-0">
              <motion.img
                src={heroIcon}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain drop-shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white/85">추천혜택</span>
              <span className="text-[18px] font-extrabold text-white">{recommendedBenefits.length}건</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white/85">마감임박</span>
              <span className="text-[18px] font-extrabold text-white">{deadlineSoonBenefits.length}건</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white/85">내 보드</span>
              <span className="text-[18px] font-extrabold text-white">{savedBenefits.length}건</span>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-t-[44px] bg-white px-5 pb-[calc(120px+env(safe-area-inset-bottom))] pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/ai-recommendation')}
            className="mb-10 flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary text-[16px] font-bold text-white shadow-soft transition-transform duration-150"
          >
            AI 맞춤 추천 받기
          </motion.button>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[22px] font-extrabold text-textMain">{aiRecommendations.length > 0 ? '맞춤 추천' : '추천 혜택'}</h2>
              <div className="flex h-7 items-center justify-center rounded-full bg-chipBg px-3 text-[14px] font-bold text-primary">
                {homeRecommendations.length}
              </div>
            </div>
            <Link to="/benefits" className="text-[14px] font-semibold text-textSub hover:text-textMain">전체보기</Link>
          </div>

          {aiRecommendations.length > 0 && (
            <p className="mb-5 rounded-[18px] bg-background px-4 py-3 text-[12px] font-semibold leading-relaxed text-textSub">
              AI 추천은 참고용 안내입니다.
              최종 자격과 신청 가능 여부는 공식 기관 사이트에서 확인해주세요.
            </p>
          )}

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : homeRecommendations.length > 0 ? (
              homeRecommendations.map((benefit) => (
                <motion.div key={benefit.id} whileTap={{ scale: 0.98 }}>
                  <Link to={`/benefits/${benefit.id}`} className="flex min-h-[96px] items-center gap-4 border-b border-divider/50 py-2 last:border-0">
                    <BenefitIcon iconType={benefit.iconType} className="h-[60px] w-[60px] rounded-[20px]" />
                    <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="shrink-0 rounded-full bg-chipBg px-2 py-0.5 text-[11px] font-extrabold text-primary">
                          {benefit.categoryLabel}
                        </span>
                        <span className="truncate text-[12px] font-semibold text-textSub">{benefit.agency}</span>
                      </div>
                      <h3 className="mb-1 line-clamp-2 text-[16px] font-bold leading-snug text-textMain">{benefit.title}</h3>
                      <p className="truncate text-[13px] font-medium text-textSub">{benefit.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="mt-12 flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-chipBg text-primary">
                  <Inbox size={32} />
                </div>
                <h3 className="mb-2 text-[16px] font-bold text-textMain">추천 혜택이 없습니다</h3>
                <p className="mb-6 text-[14px] font-medium text-textSub">AI 추천을 생성하거나 전체 목록에서 혜택을 확인해보세요.</p>
                <Link to="/benefits" className="rounded-full bg-chipBg px-6 py-3 text-[15px] font-bold text-primary">
                  혜택 찾기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
