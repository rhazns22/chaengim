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
      <div className="flex w-full flex-col min-h-[100dvh] bg-primary">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-app-page-title text-white mb-2">신청 일정</h1>
          <p className="text-app-body font-semibold text-white/90">놓치기 쉬운 마감일을 챙겨드릴게요.</p>
        </div>

        <div className="flex-1 bg-white rounded-t-[44px] px-6 pt-8 pb-[calc(120px+env(safe-area-inset-bottom))]">
          {isLoading ? (
            <div className="space-y-4"><SkeletonCard /></div>
          ) : deadlineSoonBenefits.length > 0 ? (
            <div className="flex flex-col gap-4">
              {deadlineSoonBenefits.map(item => {
                const dDay = calculateDDay(item.benefit.deadline || null);
                return (
                  <motion.div key={item.id} onClick={() => navigate(`/benefits/${item.benefitId}`)} whileTap={{ scale: 0.98 }} className="flex gap-4 items-center p-4 border border-divider rounded-[24px] bg-white shadow-sm cursor-pointer">
                    <div className={`flex flex-col items-center justify-center w-14 h-14 ${dDay !== null && dDay <= 7 && dDay >= 0 ? 'bg-danger/10 text-danger' : 'bg-chipBg text-primary'} rounded-[20px] shrink-0`}>
                      <span className="text-[14px] font-extrabold">{formatDDay(dDay)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] font-bold text-textMain truncate">{item.benefit.title}</h3>
                      <p className="text-[13px] font-semibold text-textSub mt-1">{item.benefit.deadline} 마감</p>
                    </div>
                  </motion.div>
                )
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
        </div>
      </div>
    </PageTransition>
  );
}