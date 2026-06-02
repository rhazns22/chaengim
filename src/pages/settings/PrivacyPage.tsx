import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function PrivacyPage() {
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
          <h1 className="ml-2 text-[18px] font-bold text-textMain">개인정보처리방침</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-2xl rounded-[24px] bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-[20px] font-bold text-textMain">챙김 개인정보처리방침</h2>
            <p className="mb-6 text-[13px] text-textSub">시행일: 2026년 6월 1일 | 운영자: 개인 개발자 박주은</p>

            <div className="space-y-6 text-[14px] leading-relaxed text-textMain">
              <p>개인 개발자 박주은이 운영하는 '챙김' 서비스(이하 '서비스')는 사용자의 소중한 개인정보를 안전하게 보호하고 관련 법령 및 Google Play 사용자 데이터 정책을 철저하게 준수하기 위해 다음과 같이 개인정보처리방침을 제정하여 수립 및 이행합니다.</p>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">1. 수집하는 개인정보 항목 및 수집 방법</h3>
                <p className="mb-3">서비스는 편리한 계정 인증 관리, 맞춤 혜택 필터 연산, 저장 폴더 기능을 안정적으로 공급하기 위하여 아래와 같은 범위 내에서 최소한의 개인정보를 수집하여 활용합니다.</p>
                
                <div className="space-y-3 pl-4 border-l-2 border-divider">
                  <div>
                    <h4 className="font-semibold text-textMain">[1] 회원가입 및 로그인에 필요한 정보</h4>
                    <ul className="list-disc pl-5 text-[13px] space-y-0.5 text-textSub">
                      <li>이메일 주소 및 암호화된 비밀번호 값 (자체 이메일 가입 시)</li>
                      <li>이메일 인증 관련 정보 (인증 코드의 일방향 SHA-256 해시값, 발송 시각 및 인증 만료 시각, 인증 시도 및 실패 횟수)</li>
                      <li>Google, Kakao, Naver 제공자 식별 키(ID)</li>
                      <li>이름, 닉네임 및 프로필 이미지 파일의 URL</li>
                    </ul>
                    <p className="mt-1 text-[12px] text-textSub">※ 카카오 혹은 네이버 등 이메일 정보가 완전히 제외되어 들어오는 소셜 계정의 경우, 시스템 식별 일관성 유지를 위하여 `kakao_식별자@kakao.local` 혹은 `naver_식별자@naver.local` 형식의 기계 연산용 내부 가상 메일 식별자가 부여될 수 있습니다. 이는 연락 용도로 사용되지 않는 단순 가상 키값입니다.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-textMain">[2] 맞춤 추천 및 혜택 일정 관리를 위해 사용자가 기재하는 정보</h4>
                    <p className="text-[13px] text-textSub">이용자가 프로필 설정에 직접 체크하거나 활동하며 서버 데이터베이스에 누적되는 데이터들입니다.</p>
                    <ul className="list-disc pl-5 text-[13px] space-y-0.5 text-textSub">
                      <li>거주 지역, 연령대, 관심 혜택 태그 필터</li>
                      <li>주거, 소득 분위, 고용 환경 등 혜택 자격 매치용 임시 선택 조건</li>
                      <li>회원이 직접 담아서 저장해 둔 혜택 리스트, 신청 체크리스트, 일정 일정 관리 내역</li>
                      <li><strong>알림 설정 정보, 알림 수신 여부 동의 내역, 기기 내 알림 예약 시점 정보</strong></li>
                      <li><strong>스마트폰 로컬 및 푸시 알림 수신을 위한 알림 토큰(Push Token) 또는 기기 식별값</strong></li>
                      <li><strong>알림 클릭 및 알림창 수신 상태 분석 정보</strong></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-textMain">[3] 시스템 이용 중 자동 기록되는 기기 진단 로그</h4>
                    <ul className="list-disc pl-5 text-[13px] space-y-0.5 text-textSub">
                      <li>접속 일시, 이용 오류 로그 내역, IP 주소 및 디바이스 운영체제 기기 정보</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">2. 개인정보의 수집 및 이용 목적</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>가입자 식별 및 보안 인증:</strong> 본인 연동 식별자 검증 및 중복 회원가입 억제, 부정 권한 방지</li>
                  <li><strong>사용자 맞춤형 정보 송출:</strong> 프로필 조건과 공공데이터를 대조 연산하여 지능형 혜택 정보 정밀 매칭</li>
                  <li><strong>사용자 주도 저장 관리 및 알림 발송:</strong> 신청 보드, 체크리스트 진행 내역, <strong>저장한 혜택의 마감일 안내 및 신청 준비 상태 리마인더 알림 발송</strong></li>
                  <li><strong>중요 서비스 고지:</strong> 서비스 공지사항 전달 및 필수 점검 내용 고지</li>
                  <li><strong>마케팅 정보 전달:</strong> 이용자가 <strong>별도로 사전에 명시 동의한 경우에 한하여</strong> 광고성/이벤트 혜택 정보 알림 발송</li>
                  <li><strong>서비스 보강 및 오류 해결:</strong> 디버깅 분석을 통한 서비스 고도화 및 고객센터 의견 대응</li>
                </ul>
                <p className="mt-2 text-[12px] text-textSub">※ 모든 알림 기능은 사용자의 전적인 선택에 따라 개방되며, 앱 내 알림 설정 또는 스마트폰 OS 알림 관리 시스템에서 언제든지 수신을 거부하거나 해제하실 수 있습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">3. 개인정보 보관 및 처리 위탁</h3>
                <p className="mb-2">본 서비스는 개인 개발자 운영체제이므로 별도의 물리적 데이터 센터를 임대하지 않고 공인된 글로벌 클라우드 서버 인프라를 활용하여 안전하게 데이터를 보호합니다.</p>
                
                <div className="rounded-[16px] bg-[#F6F7FB] p-4 text-[13px] space-y-2 text-textMain">
                  <p><strong>[1] Vercel (Front-end 호스팅):</strong> 글로벌 엣지 네트워크를 통한 웹 정적 리소스 배포</p>
                  <p><strong>[2] Railway (Back-end 서버):</strong> 백엔드 API 처리 서비스 컨테이너 구동</p>
                  <p><strong>[3] MySQL (데이터베이스 서버):</strong> 암호화 암호 및 서비스 연동 데이터의 안전한 실시간 관리</p>
                  <p><strong>[4] Google OAuth / Kakao OAuth / Naver OAuth:</strong> 각 소셜 제공사를 통한 본인 식별 키 수신</p>
                  <p><strong>[5] Android / Google Play / OS 알림 시스템:</strong> 스마트폰 OS 알림 센터를 통한 로컬 알림 예약 및 푸시 메시지 발송 처리</p>
                </div>
                <p className="mt-2 text-[12px] text-textSub">※ 별도의 푸시 발송 서드파티 중개사를 경유하지 않으며, 현재 사용 중인 기기(Device)의 로컬 스케줄링 리소스를 활용하여 직접 리마인더를 예약하고 작동하도록 안전하게 설계되었습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">4. 개인정보의 보유 및 이용 기간</h3>
                <p className="mb-2">회원의 개인정보는 원칙적으로 <strong>회원 가입을 한 시점부터 탈퇴 신청이 수리되어 파기되기 전까지</strong>에 한하여 보관 및 이용됩니다.</p>
                <p>사용자가 회원 탈퇴를 요청하거나 수동으로 탈퇴 처리가 수행되는 즉시 수집된 계정 정보, 추천 프로필, 개인 기록들은 시스템 데이터베이스(MySQL) 상에서 즉각 영구 삭제(Hard Delete)되어 소멸합니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">5. 개인정보의 제3자 제공 및 공유</h3>
                <p>본 서비스는 이용자의 사전 명시적 동의 없이 사용자의 개인정보를 광고 목적이나 타 목적을 위해 무단으로 제3자에게 외부에 유출, 판매 혹은 양도하지 않습니다. 단, 형사 소송법 및 정부 사법 기관이 적법한 법적 영장을 지참하여 규정에 따라 요청하는 예외의 경우에는 법이 정한 절차에 준하여 최소한의 범위만 제공합니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">6. 영업양도·인수·합병 등에 따른 개인정보 이전</h3>
                <p className="mb-2">서비스는 향후 운영자의 사정, 서비스 확장, 사업 양도, 인수, 합병, 분할, 자산 이전, 운영 주체 변경 등의 사유로 개인정보가 새로운 운영자 또는 인수자에게 이전될 수 있습니다.</p>
                <p className="mb-2">이 경우 서비스는 관련 법령에 따라 개인정보 이전 사실을 사전에 안내합니다. 안내에는 다음 사항이 포함될 수 있습니다.</p>
                <ul className="list-disc pl-5 mb-2 text-[13px] space-y-0.5 text-textSub">
                  <li>개인정보를 이전하려는 사실</li>
                  <li>개인정보를 이전받는 자의 성명 또는 명칭</li>
                  <li>개인정보를 이전받는 자의 주소, 전화번호, 이메일 등 연락처</li>
                  <li>개인정보 이전을 원하지 않는 경우 조치할 수 있는 방법과 절차</li>
                  <li>계정 삭제 또는 개인정보 삭제 요청 방법</li>
                </ul>
                <p className="mb-2">이용자는 고지된 기간 내에 개인정보 이전 거부 또는 계정 및 데이터 삭제를 요청할 수 있습니다.</p>
                <p className="mb-2 font-semibold text-primary">개인정보 이전을 원하지 않는 경우 앱 내 회원 탈퇴 기능, 계정 및 데이터 삭제 안내 페이지, 또는 문의 이메일을 통해 삭제를 요청할 수 있습니다.</p>
                <p>개인정보를 이전받은 자는 이전 당시의 본래 수집·이용 목적 범위 내에서만 개인정보를 이용할 수 있으며, 다른 목적으로 이용하려는 경우 관련 법령에 따른 별도 동의 또는 법적 근거가 필요합니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">7. 계정 및 데이터 삭제 (Google Play 정책 만족 안내)</h3>
                <p className="mb-2">Google Play 콘솔 및 모바일 데이터 세이프티 정책 가이드라인에 따라 앱을 탈퇴하고자 하거나, 앱을 미설치한 상태에서도 데이터를 철회하고자 하는 분들을 위해 <strong>이중 삭제 경로</strong>를 개방하고 있습니다.</p>
                
                <div className="space-y-2 text-[13px] text-textSub pl-4 border-l-2 border-divider">
                  <p><strong>[경로 A - 인앱 탈퇴]</strong> 로그인 후 마이페이지 ➔ 계정 설정 ➔ 회원 탈퇴 진행 시 즉각 소멸</p>
                  <p><strong>[경로 B - 웹/이메일 탈퇴]</strong> 앱 외부 웹 주소 또는 이메일 접수를 통해 본인 확인 메일 인증을 거치면 영업일 기준 3일 이내에 운영자가 직접 관리자 콘솔을 활용해 연동된 모든 계정 데이터를 완벽 파기합니다.</p>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">8. 이용자의 권리 및 거부권</h3>
                <p>이용자는 개인정보 보호책임자인 운영자에게 언제든 본인의 개인정보 기록의 조회, 오기 정보 정정, 동의 철회 및 삭제를 요구할 수 있습니다. 개인정보 처리에 관한 거부 의사를 표시할 권리가 있으며, 동의 거부 시 맞춤 추천 혜택 알림 및 일정 관리 등의 계정 관련 서비스의 이용이 제한될 수 있습니다.</p>
              </section>

              <section>
                <h3 className="mb-2 text-[15px] font-bold text-textMain">9. 개인정보 보호를 위한 대표 기술 조치</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>비밀번호 암호화 저장:</strong> 이용자의 패스워드는 단방향 해시 함수로 난독화하여 보관</li>
                  <li><strong>JWT 인증 보안 통신:</strong> 인가된 사용자 계정 토큰만 사용하도록 REST API 세션 보호</li>
                  <li><strong>보안 키 환경변수화:</strong> DB 주소 및 소셜 API 보안 키를 소스 코드 내에 표기하지 않고 격리</li>
                  <li><strong>HTTPS 통신 암호화:</strong> 사용자와 서버 간의 전송 데이터 패킷 스니핑 방지</li>
                </ul>
              </section>

              <section className="border-t border-divider pt-6">
                <h3 className="mb-2 text-[15px] font-bold text-textMain">🛡️ 개인정보 보호책임자 연락처</h3>
                <p className="text-[13px] text-textSub">사용자의 개인정보에 관한 문의사항, 침해 사실 제보 및 웹상에서의 회원 데이터 말소 요청은 아래 창구를 통해 성심성의껏 처리해 드리겠습니다.</p>
                <div className="mt-3 rounded-[16px] bg-[#F6F7FB] p-4 text-[13px] space-y-1 text-textMain">
                  <p><strong>개인정보 보호책임자:</strong> 개인 개발자 박주은</p>
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