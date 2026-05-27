const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. globals.css
write('src/styles/globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    font-weight: 500;
    color: #33384A;
    background-color: #F8F9FA;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    min-height: 100dvh;
    overscroll-behavior-y: none;
    margin: 0;
    padding: 0;
  }
}

@layer components {
  .text-app-hero {
    @apply text-[26px] sm:text-[28px] leading-tight font-extrabold text-white;
  }
  .text-app-page-title {
    @apply text-[24px] leading-snug font-extrabold;
  }
  .text-app-section {
    @apply text-[20px] sm:text-[24px] leading-snug font-extrabold;
  }
  .text-app-card {
    @apply text-[17px] sm:text-[20px] leading-snug font-bold;
  }
  .text-app-body {
    @apply text-[14px] sm:text-[15px] leading-relaxed font-medium;
  }
  .text-app-caption {
    @apply text-[12px] sm:text-[13px] leading-normal font-medium;
  }
  .text-app-button {
    @apply text-[15px] sm:text-[16px] leading-tight font-bold;
  }
  .text-app-tab {
    @apply text-[11px] sm:text-[12px] font-bold;
  }
  .text-app-chip {
    @apply text-[13px] sm:text-[14px] font-bold;
  }
}

@layer utilities {
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

html, body, #root { height: 100%; } 
* { box-sizing: border-box; }
`);

// 2. HomePage.tsx
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
            <span className="text-app-page-title text-white tracking-tight">챙김</span>
          </div>
          
          <p className="text-app-body text-white/90 mb-2 font-semibold">{user ? \`\${user.name}님을 위한 챙김\` : '당신을 위한 챙김'}</p>
          <h1 className="text-app-hero mb-8">
            놓치기 쉬운 혜택과 신청 일정을<br />한 번에 챙겨 드릴게요!
          </h1>
          
          <div className="absolute right-6 top-24 w-24 h-24 flex items-center justify-center">
            <img src={heroIcon} alt="" aria-hidden="true" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-app-caption text-white/80 mb-1 font-semibold">추천혜택</p>
              <p className="text-[20px] font-extrabold">{recommendedBenefits.length}<span className="text-app-body font-medium ml-1">건</span></p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-app-caption text-white/80 mb-1 font-semibold">마감임박</p>
              <p className="text-[20px] font-extrabold">{deadlineSoonBenefits.length}<span className="text-app-body font-medium ml-1">건</span></p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-app-caption text-white/80 mb-1 font-semibold">내 보드</p>
              <p className="text-[20px] font-extrabold">{savedBenefits.length}<span className="text-app-body font-medium ml-1">건</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 pb-10 min-h-[500px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/benefits')}
            className="w-full bg-primary text-white text-app-button h-14 rounded-btn shadow-soft mb-10 flex items-center justify-center"
          >
            맞춤형 혜택 확인하기
          </motion.button>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-app-section text-textMain">추천 혜택</h2>
              <span className="bg-chipBg text-primary text-app-caption font-bold px-2 py-0.5 rounded-full">{recommendedBenefits.length}</span>
            </div>
            <Link to="/benefits" className="text-app-caption text-textSub font-bold hover:text-textMain">전체보기 {'>'}</Link>
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
                      <h3 className="text-app-card text-textMain truncate mb-1">{benefit.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-chipBg text-primary text-[11px] font-bold px-2 py-1 rounded-md">{benefit.categoryLabel}</span>
                        <p className="text-app-body text-textSub truncate">{benefit.description}</p>
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
            <Link to="/benefits" className="text-app-button text-primary">혜택 더 찾아보기</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
`);

// 3. BenefitsPage.tsx
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
          <h1 className="text-app-page-title text-white mb-2">혜택 찾기</h1>
          <p className="text-app-body font-semibold text-white/90 mb-6">내 상황에 맞는 생활 지원 혜택을 빠르게 찾아보세요.</p>
          
          <div className="relative mb-6">
            <input 
              type="text"
              placeholder="어떤 혜택을 찾으시나요?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[52px] bg-white rounded-2xl pl-12 pr-4 text-app-body text-textMain font-semibold focus:outline-none shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={24} />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCat(cat.value)}
                className={\`whitespace-nowrap h-[38px] px-4 rounded-chip text-app-chip transition-colors \${
                  activeCat === cat.value ? 'bg-white text-primary font-extrabold' : 'bg-white/20 text-white'
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
                        <h3 className="text-app-card text-textMain truncate mb-1">{benefit.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-chipBg text-primary text-[11px] font-bold px-2 py-1 rounded-md">{benefit.categoryLabel}</span>
                          <p className="text-app-caption text-textSub truncate font-semibold">{benefit.agency}</p>
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

console.log('Typo script 1 done.');
