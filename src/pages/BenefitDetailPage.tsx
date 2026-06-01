import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Bookmark, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBenefitStore } from '../store/useBenefitStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import { useToastStore } from '../store/useToastStore';
import { useBottomSheetStore } from '../store/useBottomSheetStore';
import PrimaryButton from '../components/common/PrimaryButton';
import { SkeletonCard } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';

const formatDate = (value?: string) => {
  if (!value) return '확인 필요';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const sourceLabel: Record<string, string> = {
  manual: '수동 등록',
  official_csv: '공식 다운로드 데이터',
  sample_csv: 'CSV import 데이터',
};

export default function BenefitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBenefit, isDetailLoading, error, fetchBenefitDetail, savedBenefits, toggleBookmark } = useBenefitStore();
  const { showToast } = useToastStore();
  const { openSheet, closeSheet } = useBottomSheetStore();

  useEffect(() => {
    if (id) fetchBenefitDetail(id);
  }, [id, fetchBenefitDetail]);

  const isSaved = savedBenefits.some((saved) => saved.benefitId === selectedBenefit?.id);

  if (isDetailLoading) {
    return (
      <PageTransition className="bg-background p-6 pt-20">
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
          title="혜택 정보를 찾을 수 없습니다"
          description={error || '요청한 혜택 정보가 존재하지 않습니다.'}
          action={<PrimaryButton onClick={() => navigate(-1)} className="mt-4 px-8">뒤로 가기</PrimaryButton>}
        />
      </PageTransition>
    );
  }

  const handleApply = () => {
    if (!selectedBenefit.applyUrl) {
      showToast(`신청 방법: ${selectedBenefit.applyMethod}`);
      return;
    }
    openSheet(
      <div className="flex flex-col items-center pb-4 pt-2">
        <h3 className="mb-2 text-[20px] font-extrabold text-textMain">공식 사이트로 이동할까요?</h3>
        <p className="mb-8 text-center text-[15px] font-medium text-textSub">
          챙김은 신청을 대행하지 않습니다.<br />
          최신 신청 조건과 제출 서류는 공식 기관 사이트에서 확인해주세요.
        </p>
        <div className="flex w-full flex-col gap-3">
          <PrimaryButton
            className="w-full"
            onClick={() => {
              closeSheet();
              window.open(selectedBenefit.applyUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            공식 사이트 열기
          </PrimaryButton>
          <PrimaryButton className="w-full bg-chipBg text-textMain shadow-none active:bg-divider md:hover:bg-divider" onClick={closeSheet}>
            취소
          </PrimaryButton>
        </div>
      </div>,
    );
  };

  return (
    <PageTransition 
      className="relative flex flex-col bg-primary"
      style={{ paddingBottom: 'calc(96px + var(--bottom-safe))' }}
    >
      <div 
        className="sticky top-0 z-10 flex items-center justify-between px-4 text-white bg-primary"
        style={{
          paddingTop: 'var(--app-top-compact)',
          minHeight: 'var(--app-header-height-compact)',
        }}
      >
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center p-2">
          <ChevronLeft size={28} />
        </motion.button>
        <button onClick={() => toggleBookmark(selectedBenefit.id)} className="flex h-11 w-11 items-center justify-center p-2">
          <Bookmark size={28} className={isSaved ? 'fill-white text-white' : 'text-white/50'} />
        </button>
      </div>

      <div className="px-6 pb-8 pt-4 text-center text-white">
        <BenefitIcon iconType={selectedBenefit.iconType} className="mx-auto mb-4 h-20 w-20 rounded-[20px] bg-white/20 text-white" />
        <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-app-chip text-white">
          {selectedBenefit.categoryLabel}
        </span>
        <h1 className="mb-2 text-app-page-title text-white">{selectedBenefit.title}</h1>
        <p className="text-app-body font-semibold text-white/90">{selectedBenefit.agency}</p>
      </div>

      <div className="flex-1 rounded-t-[44px] bg-white px-6 pt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="mb-8 space-y-6">
          <section className="rounded-[24px] bg-background p-5">
            <h3 className="mb-2 text-app-card text-primary">이 혜택은 뭔가요?</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.description || selectedBenefit.title}</p>
          </section>
          <section className="rounded-[24px] bg-background p-5">
            <h3 className="mb-2 text-app-card text-primary">내가 대상인가요?</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.target}</p>
          </section>
          <section className="rounded-[24px] bg-background p-5">
            <h3 className="mb-2 text-app-card text-primary">무엇을 지원받나요?</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.supportContent}</p>
          </section>
          <section className="rounded-[24px] bg-background p-5">
            <h3 className="mb-2 text-app-card text-primary">언제까지 신청하나요?</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.deadline || '상시 신청 (공식 사이트 확인 필요)'}</p>
          </section>
          <section className="rounded-[24px] bg-background p-5">
            <h3 className="mb-2 text-app-card text-primary">어디서 신청하나요?</h3>
            <p className="text-app-body text-textMain">{selectedBenefit.applyMethod}</p>
            {selectedBenefit.documents && (
              <div className="mt-4 pt-4 border-t border-divider">
                <h4 className="mb-2 text-[14px] font-bold text-textSub">필요 서류</h4>
                <p className="text-[14px] font-medium text-textMain">{selectedBenefit.documents}</p>
              </div>
            )}
          </section>
          <section className="rounded-[24px] bg-background p-5">
            <h3 className="mb-2 text-app-card text-primary">데이터 출처</h3>
            <p className="text-app-body text-textMain">
              출처: {selectedBenefit.officialSiteName || sourceLabel[selectedBenefit.source || 'manual'] || selectedBenefit.source}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-textSub">
              데이터 기준: {sourceLabel[selectedBenefit.source || 'manual'] || selectedBenefit.source || '수동 등록'}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-textSub">
              마지막 업데이트: {formatDate(selectedBenefit.updatedAt)}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-textSub">
              챙김은 신청을 대행하지 않습니다. 실제 지급 여부와 최신 조건은 반드시 공식 기관 사이트에서 확인하세요.
            </p>
          </section>
        </div>
      </div>

      <div 
        className="fixed bottom-0 inset-x-0 mx-auto w-full md:max-w-[480px] z-50 rounded-t-[32px] border-t border-divider bg-white px-6 pt-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'calc(16px + max(env(safe-area-inset-bottom), 12px))' }}
      >
        <PrimaryButton onClick={handleApply} disabled={!selectedBenefit.applyUrl} className={!selectedBenefit.applyUrl ? 'bg-divider text-textMuted' : ''}>
          {selectedBenefit.applyUrl ? '공식 신청 페이지로 이동' : '공식 링크 준비 중'}
        </PrimaryButton>
      </div>
    </PageTransition>
  );
}
