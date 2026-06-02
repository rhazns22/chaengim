import { type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../layout/PageTransition';

interface RegisterStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  onBack: () => void;
  bottomButton: ReactNode;
  children: ReactNode;
  isTerms?: boolean;
}

export default function RegisterStepLayout({
  currentStep,
  totalSteps,
  title,
  description,
  onBack,
  bottomButton,
  children,
  isTerms = false,
}: RegisterStepLayoutProps) {
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <PageTransition className="w-full min-h-dvh bg-[#F6F7FB] flex flex-col relative overflow-x-hidden">
      {/* 상단 네비게이션 헤더 */}
      <header 
        className="flex items-center justify-between bg-[#F6F7FB] px-6 w-full"
        style={{
          paddingTop: 'var(--app-top-step-layout)',
          minHeight: 'var(--app-header-height-step-layout)',
        }}
      >
        <button 
          onClick={onBack} 
          className="-ml-2 rounded-full p-2 transition-colors active:bg-gray-100"
          type="button"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={28} className="text-textMain" />
        </button>
        
        {/* 미니멀한 스텝바 인디케이터 */}
        <div className="flex flex-col items-end">
          <span className="text-[12px] font-bold text-textSub mb-0.5">
            {currentStep}/{totalSteps}
          </span>
          <div className="w-20 h-1 bg-divider rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 본문 콘텐츠 스크롤 영역 */}
      <main 
        className="flex-grow px-6 overflow-y-auto scrollbar-hide"
        style={{ 
          paddingTop: isTerms ? '36px' : '56px',
          paddingBottom: 'calc(140px + var(--bottom-safe))'
        }}
      >
        <div className="mb-10">
          <h1 className="text-[28px] font-extrabold leading-[1.3] text-textMain tracking-tight whitespace-pre-line">
            {title}
          </h1>
          {description && (
            <p className="mt-3.5 text-[15px] font-semibold text-textSub">
              {description}
            </p>
          )}
        </div>

        <div className="w-full">
          {children}
        </div>
      </main>

      <footer 
        className="fixed bottom-0 inset-x-0 mx-auto z-20 w-full md:max-w-[480px] bg-[#F6F7FB] px-6 pt-4"
        style={{ paddingBottom: 'calc(16px + var(--bottom-safe))' }}
      >
        {bottomButton}
      </footer>
    </PageTransition>
  );
}
