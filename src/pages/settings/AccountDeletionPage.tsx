import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Mail } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function AccountDeletionPage() {
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
          <h1 className="ml-2 text-[18px] font-bold text-textMain">계정 및 데이터 삭제 안내</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-2xl rounded-[24px] bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-[20px] font-bold text-textMain">계정 및 데이터 삭제 안내</h2>
            <p className="mb-6 text-[13px] text-textSub">챙김은 사용자의 잊힐 권리를 전적으로 존중하며, 계정 및 수집된 모든 정보의 완벽한 파기를 약속드립니다.</p>

            <div className="space-y-6 text-[14px] leading-relaxed text-textMain">
              
              {/* 알림 카드 */}
              <div className="flex gap-3 rounded-[16px] bg-[#5B7CFA]/10 p-4 border border-[#5B7CFA]/20">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#5B7CFA]" />
                <div>
                  <h4 className="text-[14px] font-bold text-[#5B7CFA] mb-1">삭제 처리 시 완전히 삭제되는 정보</h4>
                  <p className="text-[12px] text-textMain leading-relaxed">
                    이메일 주소, 가입 연동 식별값, 닉네임, 프로필 이미지 정보, 관심 혜택 목록, 신청 보드 저장 데이터, 체크리스트 진행 내역, D-Day 알림 설정 등의 모든 고유 개인 식별 데이터가 MySQL 영구 삭제(Hard Delete) 조치됩니다.
                  </p>
                </div>
              </div>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">1. 모바일 앱 로그인 회원 탈퇴 (즉시 처리)</h3>
                <p className="mb-2">모바일 앱 또는 로그인 세션이 유효한 브라우저 환경을 구비하고 계신다면, 서비스 내에서 스스로 직접 즉시 데이터를 제거하실 수 있습니다.</p>
                <div className="rounded-[16px] bg-[#F6F7FB] p-4 text-[13px] text-textMain font-medium">
                  경로: [우하단 마이페이지 ➔ 계정 설정 ➔ 회원 탈퇴]
                </div>
                <p className="mt-2 text-[13px] text-textSub">회원 탈퇴 최종 수락 시 본인 인증 세션 즉시 취소 및 DB 상의 모든 사용자 종속 리소스가 즉각 소멸합니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">2. 앱 외부 웹 또는 이메일 접수를 통한 수동 삭제 요청</h3>
                <p className="mb-2">현재 기기에서 앱을 삭제하였거나 로그인 비밀번호/소셜 연동 계정을 상실하여 직접 탈퇴가 곤란한 이용자를 위해 <strong>Google Play 정책에 따라 앱 미설치 환경에서도 삭제를 접수</strong>할 수 있는 이메일 창구를 지원합니다.</p>
                
                <div className="rounded-[16px] border border-divider p-5 space-y-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[12px] text-textSub">공식 접수 전용 채널</p>
                      <p className="text-[14px] font-bold text-textMain">jueunpark.dev@gmail.com</p>
                    </div>
                  </div>

                  <div className="border-t border-divider pt-3 text-[12px] text-textSub space-y-1">
                    <p className="font-semibold text-textMain">※ 이메일 접수 시 아래의 양식을 함께 전달해 주세요.</p>
                    <p>• <strong>가입 방식:</strong> (예: 이메일 가입, Google, Kakao, Naver 중 택1)</p>
                    <p>• <strong>식별 이메일 주소:</strong> (예: example@gmail.com)</p>
                    <p>• <strong>삭제 사유 및 본인 확인 증빙:</strong> 가입자 본인의 이메일 원문 계정 메일함을 통한 접수 권장</p>
                  </div>
                </div>
                <p className="mt-2 text-[13px] text-textSub">운영자가 본인 확인 완료 후 영업일 기준 3일 이내에 데이터베이스 관리 기능을 통해 모든 관련 리소스 영구 파기 작업을 안전하게 처리하고 처리 완료 회신을 드립니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">3. 데이터 보존 예외 요건</h3>
                <p className="mb-2">사용자가 삭제를 요청할 경우 즉시 데이터를 파기하는 것이 원칙이나, 통신비밀보호법 또는 전자상거래법 등 국가 법령의 의무 기록 기간 및 불합리한 반복 탈퇴/재가입 등의 서비스 부정 이용 방지를 위한 부트스트랩 체크용 세션에 한해 암호화된 식별자가 극히 제한된 기간 동안 법적으로 격리 보관될 수 있습니다.</p>
              </section>

              <section className="border-t border-divider pt-6 text-center text-textSub text-[12px]">
                <p>본 안내 페이지는 Google Play Store 정책 요건(웹 상의 계정 삭제 신청 의무 제공)을 정밀하게 준수합니다.</p>
                <p className="mt-1">© 챙김 - 개인 개발자 박주은. All rights reserved.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
