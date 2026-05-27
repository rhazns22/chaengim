const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// HomePage
write('src/pages/HomePage.tsx', `
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBenefitStore } from '../store/useBenefitStore';
import { useAuthStore } from '../store/useAuthStore';
import AppLogo from '../components/common/AppLogo';
import BenefitIcon from '../components/common/BenefitIcon';
import heroIcon from '../assets/icons/hero-calendar-gift-check.png';
import PageTransition from '../components/layout/PageTransition';
import { SkeletonCard } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { recommendedBenefits, deadlineSoonBenefits, savedBenefits, isLoading, fetchRecommendedBenefits, fetchSavedBenefits } = useBenefitStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendedBenefits();
    fetchSavedBenefits();
  }, [fetchRecommendedBenefits, fetchSavedBenefits]);

  return (
    <PageTransition>
      <div className="w-full bg-primary min-h-full">
        <div className="px-6 pt-14 pb-12 text-white relative">
          <div className="flex items-center gap-2 mb-8">
            <AppLogo white size="md" />
            <span className="font-bold text-[24px] tracking-tight">챙김</span>
          </div>
          
          <p className="text-[14px] text-white/90 mb-2 font-medium">{user ? \`\${user.name}님을 위한 챙김\` : '당신을 위한 챙김'}</p>
          <h1 className="text-[24px] font-bold leading-snug mb-8">
            놓치기 쉬운 혜택과 신청 일정을<br />한 번에 챙겨 드릴게요!
          </h1>
          
          <div className="absolute right-6 top-24 w-24 h-24 flex items-center justify-center">
            <img src={heroIcon} alt="" aria-hidden="true" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[12px] text-white/80 mb-1">추천혜택</p>
              <p className="text-[20px] font-bold">{recommendedBenefits.length}<span className="text-[14px] font-normal ml-1">건</span></p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[12px] text-white/80 mb-1">마감임박</p>
              <p className="text-[20px] font-bold">{deadlineSoonBenefits.length}<span className="text-[14px] font-normal ml-1">건</span></p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[12px] text-white/80 mb-1">내 보드</p>
              <p className="text-[20px] font-bold">{savedBenefits.length}<span className="text-[14px] font-normal ml-1">건</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 pb-10 min-h-[500px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/benefits')}
            className="w-full bg-primary text-white font-bold h-14 rounded-btn shadow-soft mb-10 flex items-center justify-center text-[16px]"
          >
            맞춤형 혜택 확인하기
          </motion.button>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-textMain">추천 혜택</h2>
              <span className="bg-chipBg text-primary text-[12px] font-bold px-2 py-0.5 rounded-full">{recommendedBenefits.length}</span>
            </div>
            <Link to="/benefits" className="text-[13px] text-textSub font-medium hover:text-textMain">전체보기 {'>'}</Link>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : recommendedBenefits.length > 0 ? (
              recommendedBenefits.slice(0, 3).map((benefit) => (
                <motion.div key={benefit.id} whileTap={{ scale: 0.98 }}>
                  <Link to={\`/benefits/\${benefit.id}\`} className="flex items-center gap-4 p-4 rounded-card bg-white border border-divider shadow-sm min-h-[96px]">
                    <BenefitIcon iconType={benefit.iconType} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-textMain text-[17px] truncate mb-1">{benefit.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-chipBg text-primary text-[11px] font-bold px-2 py-1 rounded-md">{benefit.categoryLabel}</span>
                        <p className="text-[13px] text-textSub truncate">{benefit.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <EmptyState icon={<Inbox size={32} />} title="추천 혜택이 없어요" description="새로운 혜택이 등록될 때까지 기다려주세요." />
            )}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/benefits" className="text-[15px] font-bold text-primary">혜택 더 찾아보기</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
`);

// BenefitsPage
write('src/pages/BenefitsPage.tsx', `
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark, Inbox } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/Skeleton';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { label: '전체', value: 'all' },
  { label: '창업', value: 'startup' },
  { label: '금융', value: 'finance' },
  { label: '의료', value: 'medical' },
  { label: '교육', value: 'education' },
  { label: '생활', value: 'life' },
  { label: '복지', value: 'welfare' }
];

export default function BenefitsPage() {
  const { benefits, savedBenefits, isLoading, fetchBenefits, toggleBookmark } = useBenefitStore();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBenefits({ category: activeCat, q: search });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeCat, fetchBenefits]);

  const bookmarkedIds = savedBenefits.map(s => s.benefitId);

  return (
    <PageTransition>
      <div className="w-full bg-primary min-h-full flex flex-col">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-[24px] font-bold mb-2">혜택 찾기</h1>
          <p className="text-[14px] text-white/90 mb-6">내 상황에 맞는 생활 지원 혜택을 빠르게 찾아보세요.</p>
          
          <div className="relative mb-6">
            <input 
              type="text"
              placeholder="어떤 혜택을 찾으시나요?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[52px] bg-white rounded-2xl pl-12 pr-4 text-[15px] text-textMain focus:outline-none shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={24} />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCat(cat.value)}
                className={\`whitespace-nowrap h-[38px] px-4 rounded-chip text-[14px] font-medium transition-colors \${
                  activeCat === cat.value ? 'bg-white text-primary font-bold' : 'bg-white/20 text-white'
                }\`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 pb-10 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : benefits.length > 0 ? (
            <div className="flex flex-col gap-3">
              {benefits.map(benefit => (
                <motion.div key={benefit.id} whileTap={{ scale: 0.98 }}>
                  <div className="relative flex items-center gap-4 p-4 rounded-card border border-divider shadow-sm bg-white">
                    <Link to={\`/benefits/\${benefit.id}\`} className="flex-1 flex gap-4 min-w-0">
                      <BenefitIcon iconType={benefit.iconType} />
                      <div className="flex-1 min-w-0 pr-10">
                        <h3 className="font-bold text-textMain text-[17px] truncate mb-1">{benefit.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-chipBg text-primary text-[11px] font-bold px-2 py-1 rounded-md">{benefit.categoryLabel}</span>
                          <p className="text-[13px] text-textSub truncate">{benefit.agency}</p>
                        </div>
                      </div>
                    </Link>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => { e.preventDefault(); toggleBookmark(benefit.id); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"
                    >
                      <Bookmark size={28} className={\`transition-colors \${bookmarkedIds.includes(benefit.id) ? 'fill-primary text-primary' : 'text-divider'}\`} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Inbox size={32} />} title="검색 결과가 없어요" description="다른 키워드나 카테고리로 다시 찾아보세요." />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
`);

// BenefitDetailPage
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
        <h3 className="text-[20px] font-bold text-textMain mb-2">공식 페이지로 이동할까요?</h3>
        <p className="text-[14px] text-textSub text-center mb-8">챙김은 정보를 제공하며, 실제 신청은<br/>해당 기관의 공식 홈페이지에서 진행됩니다.</p>
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
        <span className="bg-white/20 text-white text-[12px] font-bold px-3 py-1 rounded-chip mb-3 inline-block">
          {selectedBenefit.categoryLabel}
        </span>
        <h1 className="text-[24px] font-bold mb-2 leading-tight">{selectedBenefit.title}</h1>
        <p className="text-[14px] text-white/90">{selectedBenefit.agency}</p>
      </div>

      <div className="bg-white rounded-t-sheet px-6 pt-10 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="space-y-6 mb-8">
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">지원 내용</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{selectedBenefit.supportContent}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">지원 대상</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{selectedBenefit.target}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">필요 서류</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{selectedBenefit.documents}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">신청 방법</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{selectedBenefit.applyMethod}</p>
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

// BoardPage
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
          <h1 className="text-[24px] font-bold mb-2">내 신청 보드</h1>
          <p className="text-[14px] text-white/90">저장한 혜택과 준비 상태를 관리하세요.</p>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          {isLoading ? (
            <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
          ) : savedBenefits.length > 0 ? (
            <>
              <div className="flex gap-2 mb-6">
                <motion.button onClick={() => setFilter('all')} className={\`h-[38px] px-4 rounded-chip text-[14px] font-bold \${filter === 'all' ? 'bg-textMain text-white' : 'bg-white text-textSub border border-divider'}\`}>전체</motion.button>
                <motion.button onClick={() => setFilter('preparing')} className={\`h-[38px] px-4 rounded-chip text-[14px] font-medium \${filter === 'preparing' ? 'bg-textMain text-white' : 'bg-white text-textSub border border-divider'}\`}>준비중</motion.button>
                <motion.button onClick={() => setFilter('completed')} className={\`h-[38px] px-4 rounded-chip text-[14px] font-medium \${filter === 'completed' ? 'bg-textMain text-white' : 'bg-white text-textSub border border-divider'}\`}>신청완료</motion.button>
              </div>

              <div className="flex flex-col gap-4">
                {filtered.map(item => (
                  <motion.div key={item.id} whileTap={{ scale: 0.98 }} onClick={() => navigate(\`/benefits/\${item.benefitId}\`)} className="bg-white p-5 rounded-card border border-divider shadow-sm cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <BenefitIcon iconType={item.benefit.iconType} className="w-12 h-12 rounded-xl" />
                        <div>
                          <h3 className="font-bold text-textMain text-[17px] leading-snug">{item.benefit.title}</h3>
                          <p className="text-[13px] text-textSub mt-1">{item.benefit.agency}</p>
                        </div>
                      </div>
                      <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-1 rounded-md shrink-0">
                        {item.status === 'preparing' ? '준비중' : item.status === 'completed' ? '완료' : item.status}
                      </span>
                    </div>
                    <div className="h-px bg-divider w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-textSub font-medium">상세보기</span>
                      {item.benefit.deadline && <span className="text-[14px] font-bold text-danger">마감 {item.benefit.deadline}</span>}
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

// SchedulePage
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
          <h1 className="text-[24px] font-bold mb-2">신청 일정</h1>
          <p className="text-[14px] text-white/90">놓치기 쉬운 마감일을 챙겨드릴게요.</p>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          {isLoading ? (
            <div className="space-y-4"><SkeletonCard /></div>
          ) : deadlineSoonBenefits.length > 0 ? (
            <div className="flex flex-col gap-4">
              {deadlineSoonBenefits.map(item => (
                <motion.div key={item.id} onClick={() => navigate(\`/benefits/\${item.benefitId}\`)} whileTap={{ scale: 0.98 }} className="flex gap-4 items-center p-4 border border-divider rounded-card bg-white shadow-sm cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-danger/10 text-danger rounded-2xl shrink-0">
                    <span className="text-[14px] font-bold">D-Day</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-textMain text-[17px] truncate">{item.benefit.title}</h3>
                    <p className="text-[13px] text-textSub mt-1">{item.benefit.deadline} 마감</p>
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
                  className="bg-primary text-white font-bold py-3.5 px-8 rounded-btn text-[15px] shadow-soft mt-4"
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

console.log('Frontend pages done.');
