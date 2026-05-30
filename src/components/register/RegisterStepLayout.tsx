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
}

export default function RegisterStepLayout({
  currentStep,
  totalSteps,
  title,
  description,
  onBack,
  bottomButton,
  children,
}: RegisterStepLayoutProps) {
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <PageTransition className="w-full min-h-[100dvh] bg-white flex flex-col relative">
      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white px-4">
        <button 
          onClick={onBack} 
          className="-ml-2 rounded-full p-2 transition-colors active:bg-gray-100"
          type="button"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={28} className="text-textMain" />
        </button>
        
        {/* 미니멀한 스텝바 인디케이터 */}
        <div className="flex flex-col items-end pr-2">
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
        className="flex-1 px-6 pt-6 overflow-y-auto scrollbar-hide"
        style={{ paddingBottom: 'calc(100px + max(env(safe-area-inset-bottom), 12px))' }}
      >
        <div className="mb-8">
          <h1 className="text-[26px] font-extrabold leading-[1.3] text-textMain tracking-tight whitespace-pre-line">
            {title}
          </h1>
          {description && (
            <p className="mt-2.5 text-[15px] font-semibold text-textSub">
              {description}
            </p>
          )}
        </div>

        <div className="w-full">
          {children}
        </div>
      </main>

      {/* 하단 고정 CTA 버튼 영역 */}
      <footer 
        className="fixed bottom-0 inset-x-0 mx-auto z-20 w-full md:max-w-[480px] bg-white border-t border-divider px-6 pt-4"
        style={{ paddingBottom: 'calc(16px + max(env(safe-area-inset-bottom), 12px))' }}
      >
        {bottomButton}
      </footer>
    </PageTransition>
  );
}
