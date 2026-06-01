import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function TermsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-[#F6F7FB]">
        <header 
          className="sticky top-0 z-50 flex items-center border-b border-divider bg-white px-4 shadow-sm"
          style={{
            paddingTop: 'var(--app-top-compact)',
            minHeight: 'var(--app-header-height-compact)',
          }}
        >
          <button onClick={handleBack} className="p-2 text-textMain active:opacity-50">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">이용약관</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-2xl rounded-[24px] bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-[20px] font-bold text-textMain">챙김 이용약관</h2>
            <p className="mb-6 text-[13px] text-textSub">시행일: 2026년 6월 1일 | 운영자: 개인 개발자 박주은</p>

            <div className="space-y-6 text-[14px] leading-relaxed text-textMain">
              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">1. 목적</h3>
                <p>본 약관은 개인 개발자 박주은이 운영하는 '챙김' 서비스(이하 '서비스')의 이용 조건, 절차, 이용자와 운영자의 권리 및 의무를 규정함을 목적으로 합니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">2. 서비스의 성격 및 공식 대행 부인</h3>
                <p className="mb-2 font-semibold text-primary">⚠️ 챙김은 대한민국 정부기관, 공공기관 또는 정부24의 공식 대리 앱이 아니며, 어떠한 정부 기관과도 관계가 없는 개인 개발자 서비스입니다.</p>
                <p className="mb-2">본 서비스는 정부 혜택 정보를 개인이 탐색하고, 관심 혜택을 저장하며, 신청 준비 상태와 일정을 편리하게 관리할 수 있도록 돕는 보조 도구입니다. 정부 혜택 신청을 대행하지 않습니다.</p>
                <p>서비스 내에서 제공하는 정보는 공공데이터, 정부24, 보조금24 및 각 공공기관의 공개 자료를 바탕으로 재구성한 참고용 데이터입니다. 이용자는 실제 혜택 신청 전에 반드시 정부24, 보조금24 등 공식 사이트나 관련 담당 부서에서 최신 자격 조건과 상세 사항을 확인해야 합니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">3. 제공 기능</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>정부 혜택 정보 탐색 및 상세 조회</li>
                  <li>사용자 조건 입력에 기반한 맞춤 혜택 추천</li>
                  <li>관심 혜택 보드 저장 및 폴더링</li>
                  <li>혜택별 신청 준비 상태 관리 및 체크리스트 작성</li>
                  <li>혜택 신청 일정 D-Day 관리 및 리마인더 알림</li>
                  <li>이메일 로그인 및 소셜 로그인(Google, Kakao, Naver)</li>
                  <li>AI 기반의 혜택 추천 및 요약 서비스</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">4. 회원가입 및 계정 관리</h3>
                <p className="mb-2">이용자는 이메일 계정 혹은 Google, Kakao, Naver 등 당사가 제공하는 외부 소셜 로그인 인증을 통해 간편하게 회원가입 및 로그인하여 서비스를 이용할 수 있습니다.</p>
                <p>이용자는 본인의 계정 및 비밀번호, 소셜 연동 정보를 스스로 안전하게 보관하고 관리할 책임이 있으며, 이용자의 관리 소홀로 인하여 제3자에게 유출되거나 오용되어 발생하는 모든 불이익에 대해 운영자는 책임을 지지 않습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">5. 정보의 정확성 한계 및 면책</h3>
                <p className="mb-2">운영자는 서비스 내 제공 정보의 정확성과 최신성을 유지하기 위해 신중을 기하고 노력합니다. 그러나 정부 부처와 지자체의 급격한 정책 변경, 지원 기준 조정, 선착순 마감 등에 따라 실제 집행 내용과 서비스에 기록된 정보 간에 불일치가 발생할 수 있습니다.</p>
                <p>본 서비스는 특정 혜택의 수급 가능성, 선정 여부, 지원금 지급, 또는 공식 기관의 신청 통과 결과를 어떠한 형태로도 보장하지 않습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">6. AI 추천 및 요약 기능의 한계</h3>
                <p className="mb-2">AI 기반 추천 또는 요약 정보는 사용자가 기재한 프로필 필터와 공개 데이터를 토대로 도출하는 1차 참고 자료입니다.</p>
                <p>인공지능 연산 특성상 실시간 변경 사항 누락이나 기술적 오류가 포함될 수 있으므로, 최종 수혜 자격 판정은 공식 행정기관의 심사 결과를 기준으로 삼아야 하며 운영자는 AI 결과물로 인한 오해에 책임을 지지 않습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">7. 이용자의 의무</h3>
                <p className="mb-2">이용자는 서비스를 이용할 때 법령과 본 약관을 준수해야 하며, 다음과 같은 부적절한 행위를 해서는 안 됩니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>타인의 명의, 이메일, 계정 정보를 도용하거나 도용하여 가입하는 행위</li>
                  <li>맞춤 프로필 설정 시 고의로 허위 사실을 입력하여 결과를 왜곡하는 행위</li>
                  <li>자동화 스크립트, 크롤링, 매크로 또는 부당한 서버 부하 유발 코드로 운영을 방해하는 행위</li>
                  <li>서비스의 UI/UX 디자인, 로고, 리소스 및 데이터 구조를 무단으로 복제, 배포 및 상업적으로 판매하는 행위</li>
                  <li>기타 관계 법령 및 미풍양속에 반하는 행위</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">8. 서비스 변경 및 중단</h3>
                <p>운영자는 공공데이터 API 제공처의 사정, 서버 정기 점검, 인프라의 개선 및 정책 변경 등에 따라 서비스 기능의 일부 또는 전체를 예고 없이 수정, 중단하거나 변경할 수 있으며, 이로 인해 무료 서비스 이용자에게 발생한 손해에 대하여 보상할 책임이 없습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">9. 외부 연결 링크</h3>
                <p>서비스 내에는 혜택을 실제로 접수하고 신청할 수 있도록 정부24, 복지로, 혹은 각 관공서 및 지자체 공식 웹페이지로 이어지는 링크를 제공하고 있습니다. 외부 아웃링크를 통하여 이동한 타 사이트에서 이루어지는 행위 및 그 결과에 대해서는 해당 사이트의 개별 정책이 우선 적용됩니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">10. 책임의 제한</h3>
                <p>운영자는 천재지변, 연동 API 규격 변경, 디바이스의 기술적 제약, 기지국 장애 등 운영자가 불가항력적으로 조율할 수 없는 불가항력적 원인으로 서비스를 제공할 수 없는 때에는 서비스 제공 지연 또는 중단에 책임을 면합니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">11. 계정 삭제 및 탈퇴</h3>
                <p className="mb-2">회원은 앱 내부의 [마이페이지 ➔ 계정 설정 ➔ 회원 탈퇴] 경로를 통해 계정 즉시 삭제를 신청하여 탈퇴할 수 있습니다.</p>
                <p className="mb-2">회원 탈퇴 완료 시 사용자의 계정 정보, 소셜 연결 식별자, 저장 혜택 리스트 등 모든 사용자 식별 데이터는 완전히 영구 파기되어 복구 불가능합니다.</p>
                <p>앱을 삭제하였거나 모바일 환경에 로그인할 수 없는 브라우저 환경에서도 공개 제공하는 [계정 및 데이터 삭제 안내] 경로 또는 운영자 대표 이메일을 통해 데이터의 즉각적인 말소 처리를 간편하게 신청하실 수 있습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">12. 약관의 효력 및 개정</h3>
                <p>본 약관은 회원이 서비스 가입 시 동의함과 동시에 즉시 그 효력을 발휘합니다. 운영자는 필요한 법 개정 및 운영 상황에 부합하도록 약관을 변경할 수 있으며, 변경된 내용은 앱 내부 공지사항 혹은 팝업을 통해 공지함으로써 효력을 가집니다.</p>
              </section>

              <section className="border-t border-divider pt-6">
                <h3 className="mb-2 text-[15px] font-bold text-textMain">💬 고객지원 및 문의 사항</h3>
                <p className="text-[13px] text-textSub">서비스 이용에 불편함이 있거나 개선 의견이 있으시다면 언제든 아래 문의 채널로 연락 주시면 신속히 안내해 드리겠습니다.</p>
                <div className="mt-3 rounded-[16px] bg-[#F6F7FB] p-4 text-[13px] space-y-1 text-textMain">
                  <p><strong>운영자:</strong> 개인 개발자 박주은</p>
                  <p><strong>대표 이메일:</strong> jueunpark.dev@gmail.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}