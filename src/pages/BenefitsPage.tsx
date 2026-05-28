import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Bookmark, Inbox, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBenefitStore } from '../store/useBenefitStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/Skeleton';
import { BENEFIT_CATEGORIES } from '../constants/categories';
import { calculateDDay, formatDDay } from '../utils/date';

const pageSize = 20;

export default function BenefitsPage() {
  const {
    benefits,
    savedBenefits,
    isLoading,
    error,
    benefitPage,
    benefitTotal,
    benefitHasNext,
    fetchBenefits,
    toggleBookmark,
  } = useBenefitStore();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchBenefits({ page: 1, limit: pageSize, category: activeCat, q: search });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, activeCat, fetchBenefits]);

  const bookmarkedIds = savedBenefits.map((saved) => saved.benefitId);
  const resultLabel = search || activeCat !== 'all' ? '조건에 맞는 혜택' : '전체 혜택';

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] w-full flex-col bg-primary">
        <div className="px-6 pb-8 pt-14 text-white">
          <h1 className="mb-2 text-app-page-title text-white">혜택 찾기</h1>
          <p className="mb-6 text-app-body font-semibold text-white/90">
            조건에 맞는 정부 혜택을 검색하고 공식 신청 경로를 확인하세요.
          </p>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="청년, 주거, 교육처럼 검색해보세요"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-[52px] w-full rounded-[20px] border border-white/20 bg-white/10 pl-12 pr-4 text-[15px] font-semibold text-white shadow-sm transition-all placeholder:text-white/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={24} />
          </div>

          <div className="-mx-6 overflow-x-auto pb-1 scrollbar-hide touch-scroll">
            <div className="flex w-max gap-2 px-6">
              {BENEFIT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setActiveCat(cat.value)}
                  className={[
                    'shrink-0 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all active:scale-95',
                    activeCat === cat.value ? 'bg-white text-primary shadow-sm' : 'bg-white/15 text-white/90 active:scale-[0.98] active:bg-white/25 md:hover:bg-white/25',
                  ].join(' ')}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-t-[44px] bg-white px-6 pb-[calc(128px+env(safe-area-inset-bottom))] pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[15px] font-extrabold text-textMain">
              {resultLabel} {benefitTotal.toLocaleString('ko-KR')}개
            </p>
            <p className="text-[12px] font-semibold text-textSub">페이지 {benefitPage}</p>
          </div>

          {error ? (
            <EmptyState
              icon={<AlertCircle size={32} />}
              title="혜택을 불러오지 못했습니다"
              description="잠시 후 다시 시도해주세요."
            />
          ) : isLoading && benefits.length === 0 ? (
            <div className="flex flex-col gap-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : benefits.length > 0 ? (
            <div className="flex flex-col gap-3">
              {benefits.map((benefit) => (
                <motion.div key={benefit.id} whileTap={{ scale: 0.98 }}>
                  <div className="relative flex items-center gap-4 rounded-[24px] border border-divider bg-white p-4 shadow-sm">
                    <Link to={`/benefits/${benefit.id}`} className="flex min-w-0 flex-1 gap-4">
                      <BenefitIcon iconType={benefit.iconType} />
                      <div className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-8">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="shrink-0 rounded-full bg-chipBg px-2 py-0.5 text-[11px] font-extrabold text-primary">
                            {benefit.categoryLabel}
                          </span>
                          <p className="truncate text-[12px] font-semibold text-textSub">{benefit.agency}</p>
                        </div>
                        <h3 className="line-clamp-2 text-[16px] font-bold leading-snug text-textMain mb-1">{benefit.title}</h3>
                        <p className="text-[12px] font-bold text-primary">
                          {calculateDDay(benefit.deadline || null) !== null 
                            ? `${formatDDay(calculateDDay(benefit.deadline || null)!)} 마감 · 온라인 신청 가능` 
                            : '상시 신청 · 공식 사이트 확인 필요'}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      aria-label="혜택 저장"
                      onClick={(event) => {
                        event.preventDefault();
                        toggleBookmark(benefit.id);
                      }}
                      className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center"
                    >
                      <Bookmark
                        size={28}
                        className={bookmarkedIds.includes(benefit.id) ? 'fill-primary text-primary' : 'text-divider'}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}

              {benefitHasNext && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    fetchBenefits({ page: benefitPage + 1, limit: pageSize, category: activeCat, q: search, append: true })
                  }
                  className="mt-3 h-12 rounded-full bg-chipBg text-[15px] font-extrabold text-primary disabled:opacity-60"
                >
                  {isLoading ? '불러오는 중...' : '더 보기'}
                </button>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Inbox size={32} />}
              title="검색 결과가 없습니다"
              description="다른 검색어나 카테고리로 다시 찾아보세요."
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
