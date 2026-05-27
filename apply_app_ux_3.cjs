const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. HomePage.tsx
write('src/pages/HomePage.tsx', `import { Link, useNavigate } from 'react-router-dom';
import { useBenefitStore } from '../store/useBenefitStore';
import AppLogo from '../components/common/AppLogo';
import BenefitIcon from '../components/common/BenefitIcon';
import heroIcon from '../assets/icons/hero-calendar-gift-check.png';
import PageTransition from '../components/layout/PageTransition';
import { motion } from 'framer-motion';

export default function HomePage() {
  const benefits = useBenefitStore(state => state.benefits);
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="w-full bg-primary min-h-full">
        <div className="px-6 pt-14 pb-12 text-white relative">
          <div className="flex items-center gap-2 mb-8">
            <AppLogo white size="md" />
            <span className="font-bold text-[24px] tracking-tight">챙김</span>
          </div>
          
          <p className="text-[14px] text-white/90 mb-2 font-medium">홍길동님을 위한 챙김</p>
          <h1 className="text-[24px] font-bold leading-snug mb-8">
            놓치기 쉬운 혜택과 신청 일정을<br />한 번에 챙겨 드릴게요!
          </h1>
          
          <div className="absolute right-6 top-24 w-24 h-24 flex items-center justify-center">
            <img 
              src={heroIcon} 
              alt="" 
              aria-hidden="true"
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[12px] text-white/80 mb-1">추천혜택</p>
              <p className="text-[20px] font-bold">8<span className="text-[14px] font-normal ml-1">건</span></p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[12px] text-white/80 mb-1">마감임박</p>
              <p className="text-[20px] font-bold">0<span className="text-[14px] font-normal ml-1">건</span></p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[12px] text-white/80 mb-1">내 보드</p>
              <p className="text-[20px] font-bold">3<span className="text-[14px] font-normal ml-1">건</span></p>
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
              <span className="bg-chipBg text-primary text-[12px] font-bold px-2 py-0.5 rounded-full">8</span>
            </div>
            <Link to="/benefits" className="text-[13px] text-textSub font-medium hover:text-textMain">전체보기 {'>'}</Link>
          </div>

          <div className="flex flex-col gap-3">
            {benefits.slice(0, 3).map((benefit) => (
              <motion.div key={benefit.id} whileTap={{ scale: 0.98 }}>
                <Link 
                  to={\`/benefits/\${benefit.id}\`}
                  className="flex items-center gap-4 p-4 rounded-card bg-white border border-divider shadow-sm min-h-[96px]"
                >
                  <BenefitIcon iconType={benefit.iconType} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-textMain text-[17px] truncate mb-1">{benefit.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-chipBg text-primary text-[11px] font-bold px-2 py-1 rounded-md">
                        {benefit.category}
                      </span>
                      <p className="text-[13px] text-textSub truncate">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/benefits" className="text-[15px] font-bold text-primary">
              혜택 더 찾아보기
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}`);

// 2. BenefitsPage.tsx
write('src/pages/BenefitsPage.tsx', `import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark, Inbox } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import { motion } from 'framer-motion';

const CATEGORIES = ['전체', '창업', '금융', '의료', '교육', '생활', '주거'];

export default function BenefitsPage() {
  const { benefits, bookmarkedIds, toggleBookmark } = useBenefitStore();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('전체');

  const filtered = benefits.filter(b => {
    const matchCat = activeCat === '전체' || b.category === activeCat;
    const matchSearch = b.title.includes(search) || b.description.includes(search) || b.agency.includes(search);
    return matchCat && matchSearch;
  });

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
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCat(cat)}
                className={\`whitespace-nowrap h-[38px] px-4 rounded-chip text-[14px] font-medium transition-colors \${
                  activeCat === cat 
                    ? 'bg-white text-primary font-bold' 
                    : 'bg-white/20 text-white'
                }\`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 pb-10 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filtered.map(benefit => (
                <motion.div key={benefit.id} whileTap={{ scale: 0.98 }}>
                  <div className="relative flex items-center gap-4 p-4 rounded-card border border-divider shadow-sm bg-white">
                    <Link to={\`/benefits/\${benefit.id}\`} className="flex-1 flex gap-4 min-w-0">
                      <BenefitIcon iconType={benefit.iconType} />
                      <div className="flex-1 min-w-0 pr-10">
                        <h3 className="font-bold text-textMain text-[17px] truncate mb-1">{benefit.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-chipBg text-primary text-[11px] font-bold px-2 py-1 rounded-md">
                            {benefit.category}
                          </span>
                          <p className="text-[13px] text-textSub truncate">{benefit.agency}</p>
                        </div>
                      </div>
                    </Link>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(benefit.id);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"
                    >
                      <Bookmark 
                        size={28} 
                        className={\`transition-colors \${bookmarkedIds.includes(benefit.id) ? 'fill-primary text-primary' : 'text-divider'}\`} 
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<Inbox size={32} />}
              title="검색 결과가 없어요"
              description="다른 키워드나 카테고리로 다시 찾아보세요."
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}`);

// 3. BenefitDetailPage.tsx
write('src/pages/BenefitDetailPage.tsx', `import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import { useToastStore } from '../store/useToastStore';
import { useBottomSheetStore } from '../store/useBottomSheetStore';
import PrimaryButton from '../components/common/PrimaryButton';
import { motion } from 'framer-motion';

export default function BenefitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { benefits, bookmarkedIds, toggleBookmark } = useBenefitStore();
  const { showToast } = useToastStore();
  const { openSheet, closeSheet } = useBottomSheetStore();
  const benefit = benefits.find(b => b.id === id);

  if (!benefit) return <div className="p-6 text-center">혜택을 찾을 수 없습니다.</div>;

  const isSaved = bookmarkedIds.includes(benefit.id);

  const handleBookmark = () => {
    toggleBookmark(benefit.id);
    if (!isSaved) {
      showToast('내 보드에 혜택을 저장했어요');
    } else {
      showToast('혜택 저장을 취소했어요');
    }
  };

  const handleApply = () => {
    openSheet(
      <div className="flex flex-col items-center pt-2 pb-4">
        <h3 className="text-[20px] font-bold text-textMain mb-2">공식 페이지로 이동할까요?</h3>
        <p className="text-[14px] text-textSub text-center mb-8">
          챙김은 정보를 제공하며, 실제 신청은<br/>해당 기관의 공식 홈페이지에서 진행됩니다.
        </p>
        <div className="w-full flex gap-3">
          <PrimaryButton 
            className="flex-1 bg-background !text-textMain hover:bg-divider shadow-none" 
            onClick={closeSheet}
          >
            취소
          </PrimaryButton>
          <PrimaryButton className="flex-1" onClick={() => {
            closeSheet();
            showToast('공식 페이지로 이동합니다.');
          }}>
            이동하기
          </PrimaryButton>
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
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleBookmark} className="p-2 w-11 h-11 flex items-center justify-center">
          <Bookmark size={28} className={isSaved ? 'fill-white text-white' : 'text-white/50'} />
        </motion.button>
      </div>

      <div className="px-6 pt-4 pb-8 text-white text-center">
        <BenefitIcon iconType={benefit.iconType} className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 text-white" />
        <span className="bg-white/20 text-white text-[12px] font-bold px-3 py-1 rounded-chip mb-3 inline-block">
          {benefit.category}
        </span>
        <h1 className="text-[24px] font-bold mb-2 leading-tight">{benefit.title}</h1>
        <p className="text-[14px] text-white/90">{benefit.agency}</p>
      </div>

      <div className="bg-white rounded-t-sheet px-6 pt-10 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="space-y-6 mb-8">
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">지원 내용</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{benefit.supportContent}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">지원 대상</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{benefit.target}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">필요 서류</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{benefit.documents}</p>
          </div>
          <div className="bg-background rounded-card p-5">
            <h3 className="text-[15px] font-bold text-primary mb-2">신청 방법</h3>
            <p className="text-[15px] text-textMain leading-relaxed">{benefit.applyMethod}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 bg-white border-t border-divider pb-safe z-50">
        <PrimaryButton onClick={handleApply}>
          공식 신청 페이지로 이동
        </PrimaryButton>
      </div>
    </PageTransition>
  );
}`);

console.log('Script 3 done.');
