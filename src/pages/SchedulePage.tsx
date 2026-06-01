import { Calendar, LogIn } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';
import { useAuthStore } from '../store/useAuthStore';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import PrimaryButton from '../components/common/PrimaryButton';
import { SkeletonCard } from '../components/common/Skeleton';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { calculateDDay, formatDDay } from '../utils/date';
import BenefitIcon from '../components/common/BenefitIcon';
import { getBenefitIconType } from '../utils/getBenefitIconType';

export default function SchedulePage() {
  const { deadlineSoonBenefits, isLoading } = useBenefitStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <PageTransition className="flex items-center justify-center pt-20">
        <EmptyState 
          icon={<LogIn size={32} />} 
          title="로그인이 필요해요" 
          description="일정을 관리하려면 먼저 로그인해주세요." 
          action={<PrimaryButton onClick={() => navigate('/login')} className="mt-4 px-8">로그인하기</PrimaryButton>}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden bg-white">
        <div
          className="fixed inset-0 z-0 bg-primary"
          aria-hidden="true"
          style={{ backgroundColor: '#5B7CFA', height: '50dvh' }}
        />
        <div 
          className="relative z-10 shrink-0 px-6 pb-8 text-white"
          style={{ paddingTop: 'var(--app-top-normal)' }}
        >
          <h1 className="text-app-page-title text-white mb-2">신청 일정</h1>
          <p className="text-app-body font-semibold text-white/90">놓치기 쉬운 마감일을 챙겨드릴게요.</p>
        </div>

        <main className="relative z-10 flex-1 bg-white rounded-t-[44px] px-6 pt-8 pb-8 shadow-[0_-12px_32px_rgba(15,23,42,0.04)]">
          {isLoading ? (
            <div className="space-y-4"><SkeletonCard /></div>
          ) : deadlineSoonBenefits.length > 0 ? (
            <div className="flex flex-col gap-4">
              {deadlineSoonBenefits.map(item => {
                const dDay = calculateDDay(item.benefit.deadline || null);
                const computedIconType = item.benefit.iconType || getBenefitIconType(item.benefit.category, item.benefit.title);

                return (
                  <motion.div 
                    key={item.id} 
                    onClick={() => navigate(`/benefits/${item.benefitId}`)} 
                    whileTap={{ scale: 0.98 }} 
                    className="rounded-[28px] border border-[#EEF1F7] bg-white p-4 shadow-[0_4px_20px_rgba(91,124,250,0.03)] cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <BenefitIcon
                          iconType={computedIconType}
                          size="md"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-2 text-[15px] font-bold text-textMain leading-snug">
                            {item.benefit.title}
                          </h3>

                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                            dDay !== null && dDay <= 7 && dDay >= 0 
                              ? 'bg-danger/10 text-danger' 
                              : 'bg-chipBg text-primary'
                          }`}>
                            {formatDDay(dDay)}
                          </span>
                        </div>

                        <p className="mt-1.5 text-[12px] font-semibold text-textSub">
                          {item.benefit.category || '공통'} · {item.benefit.deadline} 마감
                        </p>

                        <div className="mt-3.5 flex items-center justify-between">
                          <span className="rounded-full bg-background px-3 py-1 text-xs font-bold text-textSub">
                            {dDay !== null && dDay < 0 ? '종료됨' : '신청 가능'}
                          </span>

                          <button className="text-[12px] font-extrabold text-primary">
                            자세히 보기
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon={<Calendar size={32} />}
              title="아직 마감 일정이 없어요"
              description="마감일이 있는 혜택을 저장하면 D-Day 순서로 신청 일정을 확인할 수 있어요."
              action={
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/benefits')}
                  className="bg-primary text-white text-app-button py-3.5 px-8 rounded-full shadow-soft mt-4"
                >
                  혜택 둘러보기
                </motion.button>
              }
            />
          )}
        </main>
      </div>
    </PageTransition>
  );
}