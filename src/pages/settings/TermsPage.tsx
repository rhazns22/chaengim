import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function TermsPage() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-divider bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">이용약관</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 pb-10 text-[14px] leading-relaxed text-textMain">
          <h2 className="mb-4 text-[16px] font-bold">서비스 이용약관</h2>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">제1조 (목적)</h3>
            <p>본 약관은 챙김 서비스(이하 "서비스")의 이용 조건 및 절차에 관한 사항을 규정합니다.</p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">제2조 (서비스 안내)</h3>
            <p className="mb-3">챙김은 정부 신청을 대행하는 서비스가 아니라, 혜택 탐색과 신청 준비 관리를 돕는 MVP입니다.</p>
            <p className="mb-3">실제 신청 가능 여부와 최종 자격 확인은 각 공식 기관 사이트에서 진행해야 합니다.</p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">제3조 (AI 추천 안내)</h3>
            <p>AI 추천은 입력 정보를 바탕으로 한 참고용 안내이며, 자격 판정이나 수급 보장을 의미하지 않습니다.</p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">제4조 (회원 탈퇴)</h3>
            <p>회원은 언제든지 탈퇴를 신청할 수 있으며, 탈퇴 시 모든 개인 데이터는 즉시 삭제됩니다.</p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}