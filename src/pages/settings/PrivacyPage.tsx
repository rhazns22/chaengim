import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function PrivacyPage() {
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
          <h1 className="ml-2 text-[18px] font-bold text-textMain">개인정보 처리방침</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 pb-10 text-[14px] leading-relaxed text-textMain">
          <h2 className="mb-4 text-[16px] font-bold">개인정보 처리방침</h2>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">1. 수집하는 개인정보 항목</h3>
            <p>챙김은 사용자 맞춤 혜택 추천을 위해 최소한의 정보만 수집합니다.</p>
            <ul className="mt-2 list-disc pl-5">
              <li>이메일 주소, 이름 (회원가입 시)</li>
              <li>출생연도, 지역, 고용상태, 소득수준, 가구유형 (AI 프로필 설정 시)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">2. 수집하지 않는 정보</h3>
            <p>챙김은 다음 민감한 정보는 수집하지 않습니다.</p>
            <ul className="mt-2 list-disc pl-5">
              <li>주민등록번호</li>
              <li>계좌 및 카드 정보</li>
              <li>정확한 재산 정보</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-bold">3. 정보의 보유 및 이용 기간</h3>
            <p>회원 탈퇴 시 모든 개인 데이터는 즉시 삭제됩니다.</p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}