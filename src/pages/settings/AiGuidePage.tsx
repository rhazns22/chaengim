import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function AiGuidePage() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header 
          className="sticky top-0 z-50 flex items-center border-b border-divider bg-white px-4"
          style={{
            paddingTop: 'var(--app-top-compact)',
            minHeight: 'var(--app-header-height-compact)',
          }}
        >
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">AI 추천 안내</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 pb-10 text-[14px] leading-relaxed text-textMain">
          <h2 className="mb-4 text-[16px] font-bold">AI 추천 시스템 안내</h2>

          <div className="mb-6 rounded-[16px] bg-primary/5 p-4">
            <p className="font-bold text-primary">
              AI 추천은 입력 정보를 바탕으로 한 참고용 안내이며,<br />
              자격 판정이나 수급 보장을 의미하지 않습니다.
            </p>
          </div>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">AI 추천이란?</h3>
            <p>챙김의 AI 추천은 사용자가 입력한 프로필 정보(출생연도, 지역, 고용상태 등)와 공개된 정부 혜택 정보를 분석하여, 해당 사용자에게 적합할 가능성이 높은 혜택을 안내해 드리는 기능입니다.</p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">주의사항</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>챙김은 정부 신청을 대행하는 서비스가 아니라, 혜택 탐색과 신청 준비 관리를 돕는 MVP입니다.</li>
              <li>실제 신청 가능 여부와 최종 자격 확인은 각 공식 기관 사이트에서 진행해야 합니다.</li>
              <li>AI 추천 결과는 최신 정책 변경 사항을 반영하지 못할 수 있습니다.</li>
              <li>추천 점수는 절대적 자격 기준이 아닌 참고용 지표입니다.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">더 정확한 추천을 위해</h3>
            <p>AI 프로필을 최신 정보로 유지하면 더 정확한 추천을 받을 수 있습니다. 마이페이지에서 AI 맞춤 프로필을 수정해 보세요.</p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}