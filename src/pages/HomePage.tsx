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
import { calculateDDay, formatDDay } from '../utils/date';
import AnimatedNumber from '../components/common/AnimatedNumber';

export default function HomePage() {
  const { recommendedBenefits, deadlineSoonBenefits, savedBenefits, isLoading, fetchRecommendedBenefits, fetchSavedBenefits } = useBenefitStore();
  const { user } = useAuthStore();
  const { recommendations: aiRecommendations, fetchRecommendations, needsProfileSetup } = useAiRecommendationStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Chaengim] iOS safe-area layout patch v5 loaded');
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
      <div className="relative flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden bg-white">
        <div
          className="fixed inset-0 z-0 bg-primary"
          aria-hidden="true"
          style={{ backgroundColor: '#5B7CFA', height: '50dvh' }}
        />

        {/* 파란색 상단 Hero 섹션 - safe-area를 포함해 status bar까지 직접 덮도록 설정 */}
        <section 
          className="relative bg-primary text-white z-10 px-6 shrink-0" 
          style={{ 
            paddingTop: 'calc(env(safe-area-inset-top) + 24px)',
            paddingBottom: '72px'
          }}
        >
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

          <div className="flex items-center justify-between px-2 mt-8">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white/85">추천혜택</span>
              <AnimatedNumber value={recommendedBenefits.length} suffix="건" className="text-[18px] font-extrabold text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white/85">마감임박</span>
              <AnimatedNumber value={deadlineSoonBenefits.length} suffix="건" className="text-[18px] font-extrabold text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white/85">내 보드</span>
              <AnimatedNumber value={savedBenefits.length} suffix="건" className="text-[18px] font-extrabold text-white" />
            </div>
          </div>
        </section>

        {/* 흰색 Rounded 콘텐츠 시트 */}
        <main 
          className="relative z-20 flex-1 bg-white rounded-t-[32px] px-6 pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]"
          style={{ 
            marginTop: '-40px',
            paddingBottom: '32px'
          }}
        >
          <div className="mb-10 flex gap-3">
            {user ? (
              !needsProfileSetup && aiRecommendations.length > 0 ? (
                <>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/ai-recommendation')}
                    className="flex h-[56px] flex-1 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white shadow-soft"
                  >
                    맞춤 추천 다시 보기
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/benefits')}
                    className="flex h-[56px] flex-1 items-center justify-center rounded-full bg-chipBg text-[15px] font-bold text-primary"
                  >
                    새 혜택 둘러보기
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/profile-setup')}
                    className="flex h-[56px] flex-1 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white shadow-soft"
                  >
                    내 조건으로 혜택 추천받기
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/benefits')}
                    className="flex h-[56px] flex-1 items-center justify-center rounded-full bg-chipBg text-[15px] font-bold text-primary"
                  >
                    전체 혜택 둘러보기
                  </motion.button>
                </>
              )
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/benefits')}
                  className="flex h-[56px] flex-1 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white shadow-soft"
                >
                  혜택 둘러보기
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="flex h-[56px] flex-1 items-center justify-center rounded-full bg-chipBg text-[15px] font-bold text-primary"
                >
                  로그인하고 저장하기
                </motion.button>
              </>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[22px] font-extrabold text-textMain">{aiRecommendations.length > 0 ? '맞춤 추천' : '추천 혜택'}</h2>
              <AnimatedNumber
                value={homeRecommendations.length}
                className="flex h-7 items-center justify-center rounded-full bg-chipBg px-3 text-[14px] font-bold text-primary"
              />
            </div>
            <Link to="/benefits" className="text-[14px] font-semibold text-textSub transition-colors active:text-textMain md:hover:text-textMain">전체보기</Link>
          </div>

          {aiRecommendations.length > 0 && (
            <p className="mb-5 rounded-[18px] bg-background px-4 py-3 text-[12px] font-semibold leading-relaxed text-textSub">
              입력한 프로필과 혜택 조건의 일치도를 기준으로 계산한 참고 점수입니다. 최종 자격은 공식 기관에서 확인하세요.
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
                <motion.div key={benefit.id} whileTap={{ scale: 0.985 }} transition={{ duration: 0.16 }}>
                  <Link to={`/benefits/${benefit.id}`} className="flex min-h-[96px] items-center gap-4 border-b border-divider/50 py-2 transition-colors active:bg-slate-50/50 last:border-0">
                    <BenefitIcon iconType={benefit.iconType} className="h-[60px] w-[60px] rounded-[20px]" />
                    <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="shrink-0 rounded-full bg-chipBg px-2 py-0.5 text-[11px] font-extrabold text-primary">
                          {benefit.categoryLabel}
                        </span>
                        <span className="truncate text-[12px] font-semibold text-textSub">{benefit.agency}</span>
                      </div>
                      <h3 className="mb-1 line-clamp-2 text-[16px] font-bold leading-snug text-textMain">{benefit.title}</h3>
                      <p className="truncate text-[13px] font-medium text-textSub mb-1">{benefit.description}</p>
                      <p className="text-[12px] font-bold text-primary">
                        {calculateDDay(benefit.deadline || null) !== null 
                          ? `${formatDDay(calculateDDay(benefit.deadline || null)!)} 마감 · 온라인 신청 가능` 
                          : '상시 신청 · 공식 사이트 확인 필요'}
                      </p>
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
        </main>
      </div>
    </PageTransition>
  );
}
