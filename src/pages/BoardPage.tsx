import { useEffect, useState } from 'react';
import { useBenefitStore } from '../store/useBenefitStore';
import { useAuthStore } from '../store/useAuthStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/Skeleton';
import { ClipboardList, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { calculateDDay, formatDDay } from '../utils/date';
import AnimatedNumber from '../components/common/AnimatedNumber';

export default function BoardPage() {
  const { savedBenefits, isLoading, fetchSavedBenefits } = useBenefitStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) fetchSavedBenefits();
  }, [user, fetchSavedBenefits]);

  if (!user) {
    return (
      <PageTransition className="flex items-center justify-center pt-20">
        <EmptyState 
          icon={<LogIn size={32} />} 
          title="로그인이 필요해요" 
          description="내 보드를 사용하려면 먼저 로그인해주세요." 
          action={<PrimaryButton onClick={() => navigate('/login')} className="mt-4 px-8">로그인하기</PrimaryButton>}
        />
      </PageTransition>
    );
  }

  const filtered = filter === 'all' ? savedBenefits : savedBenefits.filter(s => s.status === filter);

  return (
    <PageTransition>
      <div className="flex w-full flex-col min-h-[100dvh] bg-primary">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-app-page-title text-white mb-2">내 신청 보드</h1>
          <p className="text-app-body font-semibold text-white/90">저장한 혜택과 준비 상태를 관리하세요.</p>
        </div>

        <div className="flex-1 bg-white rounded-t-[44px] px-6 pt-8 pb-[calc(120px+env(safe-area-inset-bottom))]">
          {isLoading ? (
            <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
          ) : savedBenefits.length > 0 ? (
            <>
              <div className="flex gap-2 mb-6">
                <motion.button onClick={() => setFilter('all')} className={`h-[38px] px-4 rounded-full text-app-chip ${filter === 'all' ? 'bg-textMain text-white' : 'bg-white text-textSub border border-divider'}`}>전체</motion.button>
                <motion.button onClick={() => setFilter('preparing')} className={`h-[38px] px-4 rounded-full text-app-chip ${filter === 'preparing' ? 'bg-textMain text-white font-extrabold' : 'bg-white text-textSub border border-divider font-semibold'}`}>준비중</motion.button>
                <motion.button onClick={() => setFilter('completed')} className={`h-[38px] px-4 rounded-full text-app-chip ${filter === 'completed' ? 'bg-textMain text-white font-extrabold' : 'bg-white text-textSub border border-divider font-semibold'}`}>신청완료</motion.button>
              </div>

              <div className="flex flex-col gap-4">
                {filtered.map(item => {
                  const checklistCount = item.checklist?.length || 0;
                  const checkedCount = item.checklist?.filter((c: any) => c.checked).length || 0;
                  const progress = checklistCount === 0 ? 0 : Math.round((checkedCount / checklistCount) * 100);
                  const dDay = calculateDDay(item.benefit.deadline || null);
                  
                  return (
                    <motion.div key={item.id} whileTap={{ scale: 0.98 }} onClick={() => navigate(`/benefits/${item.benefitId}`)} className="bg-white p-5 rounded-[24px] border border-divider shadow-sm cursor-pointer relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <BenefitIcon iconType={item.benefit.iconType} className="w-12 h-12 rounded-[20px]" />
                          <div>
                            <h3 className="text-[16px] font-bold text-textMain line-clamp-1">{item.benefit.title}</h3>
                            <p className="text-[13px] font-semibold text-textSub mt-1">{item.benefit.agency}</p>
                          </div>
                        </div>
                        <span className="bg-chipBg text-primary text-[12px] font-extrabold px-2.5 py-1.5 rounded-full shrink-0 flex items-center h-fit">
                          {item.status === 'preparing' ? '준비중' : item.status === 'completed' ? '완료' : item.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-[12px] font-bold mb-1.5">
                          <span className="text-textSub">서류 준비 <span className="text-primary">{checkedCount}/{checklistCount}</span></span>
                          <AnimatedNumber value={progress} suffix="%" className="text-textMain" />
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-primary h-full rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="h-px bg-divider w-full mb-3"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-textSub font-bold flex items-center gap-1">상세보기 및 체크리스트</span>
                        {dDay !== null ? (
                           <span className={`text-[13px] font-extrabold ${dDay <= 7 && dDay >= 0 ? 'text-danger' : 'text-primary'}`}>
                             마감 {formatDDay(dDay)}
                           </span>
                        ) : (
                          <span className="text-[13px] font-extrabold text-textMuted">상시</span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </>
          ) : (
            <EmptyState 
              icon={<ClipboardList size={32} />}
              title="아직 저장한 혜택이 없어요"
              description="관심 있는 혜택을 저장하면 신청 준비 상태와 필요한 서류를 한 곳에서 관리할 수 있어요."
              action={<PrimaryButton onClick={() => navigate('/benefits')} className="mt-4 px-8">혜택 찾으러 가기</PrimaryButton>}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}