const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. BenefitDetailPage.tsx
write('src/pages/BenefitDetailPage.tsx', `
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark, AlertCircle } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import { useToastStore } from '../store/useToastStore';
import { useBottomSheetStore } from '../store/useBottomSheetStore';
import PrimaryButton from '../components/common/PrimaryButton';
import { SkeletonCard } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { motion } from 'framer-motion';

export default function BenefitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBenefit, isDetailLoading, error, fetchBenefitDetail, savedBenefits, toggleBookmark } = useBenefitStore();
  const { showToast } = useToastStore();
  const { openSheet, closeSheet } = useBottomSheetStore();

  useEffect(() => {
    if (id) fetchBenefitDetail(id);
  }, [id, fetchBenefitDetail]);

  const isSaved = savedBenefits.some(s => s.benefitId === selectedBenefit?.id);

  if (isDetailLoading) {
    return (
      <PageTransition className="p-6 bg-background pt-20">
        <SkeletonCard />
        <SkeletonCard />
      </PageTransition>
    );
  }

  if (error || !selectedBenefit) {
    return (
      <PageTransition className="flex items-center justify-center pt-20">
        <EmptyState 
          icon={<AlertCircle size={32} />} 
          title="페이지를 찾을 수 없습니다" 
          description={error || '혜택 정보가 존재하지 않습니다.'} 
          action={<PrimaryButton onClick={() => navigate(-1)} className="mt-4 px-8">뒤로 가기</PrimaryButton>}
        />
      </PageTransition>
    );
  }

  const handleApply = () => {
    if (!selectedBenefit.applyUrl) {
      showToast('신청 방법: ' + selectedBenefit.applyMethod);
      return;
    }
    openSheet(
      <div className="flex flex-col items-center pt-2 pb-4">
        <h3 className="text-app-section text-textMain mb-2">공식 페이지로 이동할까요?</h3>
        <p className="text-app-body text-textSub text-center mb-8">챙김은 정보를 제공하며, 실제 신청은<br/>해당 기관의 공식 홈페이지에서 진행됩니다.</p>
        <div className="w-full flex gap-3">
          <PrimaryButton className="flex-1 bg-background !text-textMain hover:bg-divider shadow-none" onClick={closeSheet}>취소</PrimaryButton>
          <PrimaryButton className="flex-1" onClick={() => { closeSheet(); window.open(selectedBenefit.applyUrl, '_blank'); }}>이동하기</PrimaryButton>
        </div>
      </div>
    );
  };

  return (
    <PageTransition className="flex flex-col relative pb-[100px] bg-primary">
      <div className="flex items-center justify-between h-14 px-4 sticky top-0 z-10 text-white">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 w-11 h-11 flex items-center justify-center">
          <ChevronLeft size={28} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleBookmark(selectedBenefit.id)} className="p-2 w-11 h-11 flex items-center justify-center">
          <Bookmark size={28} className={isSaved ? 'fill-white text-white' : 'text-white/50'} />
        </motion.button>
      </div>

      <div className="px-6 pt-4 pb-8 text-white text-center">
        <BenefitIcon iconType={selectedBenefit.iconType} className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 text-white" />
        <span className="bg-white/20 text-white text-app-chip px-3 py-1 rounded-chip mb-3 inline-block">
          {selectedBenefit.categoryLabel}
        </span>
        <h1 className="text-app-page-title text-white mb-2">{selectedBenefit.title}</h1>
        <p className="text-app-body font-semibold text-white/90">{selectedBenefit.agency}</p>
      </div>

      <div className="bg-white rounded-t-sheet px-6 pt-10 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="space-y-6 mb-8">
          <div className="bg-background rounded-card p-5">
            <h3 className="text-app-card text-primary mb-2">지원 내용</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.supportContent}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-app-card text-primary mb-2">지원 대상</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.target}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-app-card text-primary mb-2">필요 서류</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.documents}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-app-card text-primary mb-2">신청 방법</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.applyMethod}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 bg-white border-t border-divider pb-safe z-50">
        <PrimaryButton onClick={handleApply}>
          {selectedBenefit.applyUrl ? '공식 신청 페이지로 이동' : '신청 방법 확인하기'}
        </PrimaryButton>
      </div>
    </PageTransition>
  );
}
`);

// 2. BoardPage.tsx
write('src/pages/BoardPage.tsx', `
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
      <div className="w-full bg-primary min-h-full flex flex-col">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-app-page-title text-white mb-2">내 신청 보드</h1>
          <p className="text-app-body font-semibold text-white/90">저장한 혜택과 준비 상태를 관리하세요.</p>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          {isLoading ? (
            <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
          ) : savedBenefits.length > 0 ? (
            <>
              <div className="flex gap-2 mb-6">
                <motion.button onClick={() => setFilter('all')} className={\`h-[38px] px-4 rounded-chip text-app-chip \${filter === 'all' ? 'bg-textMain text-white' : 'bg-white text-textSub border border-divider'}\`}>전체</motion.button>
                <motion.button onClick={() => setFilter('preparing')} className={\`h-[38px] px-4 rounded-chip text-app-chip \${filter === 'preparing' ? 'bg-textMain text-white font-extrabold' : 'bg-white text-textSub border border-divider font-semibold'}\`}>준비중</motion.button>
                <motion.button onClick={() => setFilter('completed')} className={\`h-[38px] px-4 rounded-chip text-app-chip \${filter === 'completed' ? 'bg-textMain text-white font-extrabold' : 'bg-white text-textSub border border-divider font-semibold'}\`}>신청완료</motion.button>
              </div>

              <div className="flex flex-col gap-4">
                {filtered.map(item => (
                  <motion.div key={item.id} whileTap={{ scale: 0.98 }} onClick={() => navigate(\`/benefits/\${item.benefitId}\`)} className="bg-white p-5 rounded-card border border-divider shadow-sm cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <BenefitIcon iconType={item.benefit.iconType} className="w-12 h-12 rounded-xl" />
                        <div>
                          <h3 className="text-app-card text-textMain">{item.benefit.title}</h3>
                          <p className="text-app-caption font-semibold text-textSub mt-1">{item.benefit.agency}</p>
                        </div>
                      </div>
                      <span className="bg-primary/10 text-primary text-[12px] font-extrabold px-2 py-1 rounded-md shrink-0">
                        {item.status === 'preparing' ? '준비중' : item.status === 'completed' ? '완료' : item.status}
                      </span>
                    </div>
                    <div className="h-px bg-divider w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-app-body text-textSub font-bold">상세보기</span>
                      {item.benefit.deadline && <span className="text-[14px] font-extrabold text-danger">마감 {item.benefit.deadline}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState 
              icon={<ClipboardList size={32} />}
              title="아직 저장한 혜택이 없어요"
              description="관심 있는 혜택을 저장하면 내 보드에서 한 번에 관리할 수 있어요."
              action={<PrimaryButton onClick={() => navigate('/benefits')} className="mt-4 px-8">혜택 둘러보기</PrimaryButton>}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
`);

// 3. SchedulePage.tsx
write('src/pages/SchedulePage.tsx', `
import { Calendar, LogIn } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';
import { useAuthStore } from '../store/useAuthStore';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import PrimaryButton from '../components/common/PrimaryButton';
import { SkeletonCard } from '../components/common/Skeleton';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
      <div className="w-full bg-primary min-h-full flex flex-col">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-app-page-title text-white mb-2">신청 일정</h1>
          <p className="text-app-body font-semibold text-white/90">놓치기 쉬운 마감일을 챙겨드릴게요.</p>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          {isLoading ? (
            <div className="space-y-4"><SkeletonCard /></div>
          ) : deadlineSoonBenefits.length > 0 ? (
            <div className="flex flex-col gap-4">
              {deadlineSoonBenefits.map(item => (
                <motion.div key={item.id} onClick={() => navigate(\`/benefits/\${item.benefitId}\`)} whileTap={{ scale: 0.98 }} className="flex gap-4 items-center p-4 border border-divider rounded-card bg-white shadow-sm cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-danger/10 text-danger rounded-2xl shrink-0">
                    <span className="text-[14px] font-extrabold">D-Day</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-app-card text-textMain truncate">{item.benefit.title}</h3>
                    <p className="text-app-caption font-semibold text-textSub mt-1">{item.benefit.deadline} 마감</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<Calendar size={32} />}
              title="다가오는 마감 일정이 없어요"
              description="혜택을 저장하면 신청 마감일을 챙겨드릴게요."
              action={
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/benefits')}
                  className="bg-primary text-white text-app-button py-3.5 px-8 rounded-btn shadow-soft mt-4"
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
`);

// 4. BottomNav.tsx
write('src/components/layout/BottomNav.tsx', `
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ClipboardList, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: '홈', path: '/' },
  { icon: Search, label: '혜택찾기', path: '/benefits' },
  { icon: ClipboardList, label: '내보드', path: '/board' },
  { icon: Calendar, label: '신청일정', path: '/schedule' },
  { icon: User, label: '마이', path: '/mypage' },
];

export default function BottomNav() {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/splash') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-divider pb-safe z-40">
      <nav className="flex justify-around items-center h-[60px] px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              \`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors \${
                isActive ? 'text-primary' : 'text-textMuted'
              }\`
            }
          >
            {({ isActive }) => (
              <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center">
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-primary/10' : ''} />
                <span className={\`text-app-tab \${isActive ? 'font-extrabold' : 'font-bold'}\`}>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
`);

// 5. MyPage.tsx
write('src/pages/MyPage.tsx', `
import { Settings, Bell, ChevronRight, LogOut, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { motion } from 'framer-motion';
import PrimaryButton from '../components/common/PrimaryButton';

export default function MyPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/splash');
  };

  return (
    <PageTransition>
      <div className="w-full bg-primary min-h-full flex flex-col">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-app-page-title text-white mb-2">마이페이지</h1>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          <div className="bg-white p-6 rounded-[28px] border border-divider flex items-center gap-4 mb-8 shadow-sm">
            <div className="w-16 h-16 bg-chipBg rounded-2xl flex items-center justify-center text-primary font-extrabold text-[24px]">
              {user?.name?.[0] || '게'}
            </div>
            <div>
              <h2 className="text-app-section text-textMain mb-1">{user?.name || '게스트'} 님</h2>
              <p className="text-app-body font-semibold text-textSub">{user?.email || '로그인해주세요'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: Bell, label: '알림 설정' },
              { icon: Settings, label: '계정 설정' },
              { icon: FileText, label: '공지사항' },
            ].map((menu, idx) => (
              <motion.button 
                key={idx} 
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-5 bg-white border border-divider rounded-card shadow-sm w-full"
              >
                <div className="flex items-center gap-3">
                  <menu.icon className="text-textSub" size={24} />
                  <span className="font-extrabold text-textMain text-[16px]">{menu.label}</span>
                </div>
                <ChevronRight className="text-textMuted" size={20} />
              </motion.button>
            ))}
            
            {user ? (
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout} 
                className="flex items-center justify-between p-5 bg-white border border-divider rounded-card shadow-sm w-full mt-4"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="text-danger" size={24} />
                  <span className="font-extrabold text-danger text-[16px]">로그아웃</span>
                </div>
              </motion.button>
            ) : (
              <div className="mt-6">
                <PrimaryButton onClick={() => navigate('/login')}>로그인하기</PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
`);

// 6. PrimaryButton.tsx (just update to use text-app-button)
write('src/components/common/PrimaryButton.tsx', `
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function PrimaryButton({ children, onClick, className = '' }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={\`w-full bg-primary text-white text-app-button h-14 rounded-btn shadow-soft flex items-center justify-center \${className}\`}
    >
      {children}
    </motion.button>
  );
}
`);

console.log('Typo script 2 done.');
