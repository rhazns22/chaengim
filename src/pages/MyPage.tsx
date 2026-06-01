import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, FileText, Settings, Camera, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useBenefitStore } from '../store/useBenefitStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import { useBottomSheetStore } from '../store/useBottomSheetStore';
import { useToastStore } from '../store/useToastStore';
import { httpClient as api } from '../api/httpClient';
import AnimatedNumber from '../components/common/AnimatedNumber';

const MAIN_SETTINGS = [
  { icon: Bell, label: '알림 설정', desc: '마감 7일/3일/1일 전 알림을 관리해요', path: '/settings/notifications' },
  { icon: Settings, label: '계정 설정', desc: '이름, 이메일, 비밀번호 정보를 관리해요', path: '/settings/account' },
  { icon: User, label: 'AI 맞춤 프로필', desc: '내 조건에 맞는 혜택 추천 정보를 수정해요', path: '/settings/profile' },
];

const SERVICE_INFO = [
  { icon: FileText, label: '공지사항', desc: '서비스 업데이트와 안내를 확인해요', path: '/settings/notices' },
  { icon: FileText, label: 'AI 추천 안내', desc: '챙김의 AI 추천 방식과 한계를 확인해요', path: '/settings/ai-guide' },
];

const POLICIES = [
  { icon: FileText, label: '이용약관', desc: '서비스 이용 기준을 확인해요', path: '/settings/terms' },
  { icon: FileText, label: '개인정보 처리방침', desc: '개인정보 수집과 이용 방식을 확인해요', path: '/settings/privacy' },
];

export default function MyPage() {
  const { user, isGuest, logout } = useAuthStore();
  const navigate = useNavigate();
  const { savedBenefits, fetchSavedBenefits } = useBenefitStore();
  const { profile, fetchProfile } = useAiRecommendationStore();
  const { openSheet, closeSheet } = useBottomSheetStore();
  const showToast = useToastStore((state) => state.showToast);
  const [hasNotificationSettings, setHasNotificationSettings] = useState<boolean>(false);

  const isUnauthenticated = !user || isGuest;

  useEffect(() => {
    if (!isUnauthenticated) {
      fetchSavedBenefits();
      fetchProfile();
      api.get('/me/notification-settings')
        .then((res) => setHasNotificationSettings(!!res.data))
        .catch(() => setHasNotificationSettings(false));
    }
  }, [isUnauthenticated, fetchSavedBenefits, fetchProfile]);

  const confirmLogout = () => {
    openSheet(
      <div className="flex flex-col items-center">
        <h3 className="mb-2 text-[20px] font-extrabold text-textMain">로그아웃 하시겠어요?</h3>
        <p className="mb-8 text-[15px] font-medium text-textSub">현재 기기에서 계정을 로그아웃합니다.</p>

        <div className="flex w-full flex-col gap-3">
          <PrimaryButton
            className="w-full bg-danger text-white"
            onClick={() => {
              logout();
              closeSheet();
              showToast('로그아웃되었습니다.');
              navigate('/login');
            }}
          >
            로그아웃
          </PrimaryButton>
          <PrimaryButton className="w-full bg-chipBg text-textMain" onClick={closeSheet}>
            취소
          </PrimaryButton>
        </div>
      </div>,
    );
  };

  const handleProfilePhotoClick = () => {
    if (isUnauthenticated) {
      showToast('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    showToast('프로필 사진 설정 기능은 준비 중입니다.');
  };

  const handleAiProfileClick = () => {
    if (isUnauthenticated) {
      showToast('로그인 후 이용할 수 있어요.');
      navigate('/login');
    } else {
      navigate('/settings/profile');
    }
  };

  const handleWithdrawClick = () => {
    openSheet(
      <div className="flex w-full flex-col items-center">
        <h3 className="mb-2 text-[18px] font-extrabold text-textMain">회원 탈퇴</h3>
        <p className="mb-1 text-center text-[14px] font-bold leading-relaxed text-danger">
          탈퇴 시 저장한 혜택, 체크리스트,<br />AI 프로필 정보가 모두 삭제됩니다.
        </p>
        <p className="mb-6 text-[13px] font-medium text-textSub">
          이 작업은 되돌릴 수 없습니다.
        </p>

        <div className="flex w-full flex-col gap-2.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex h-[52px] w-full items-center justify-center rounded-full border border-danger/50 bg-white text-[14px] font-bold text-danger shadow-sm active:bg-danger/5"
            onClick={() => {
              closeSheet();
              navigate('/settings/withdraw');
            }}
          >
            탈퇴 진행하기
          </motion.button>
          <PrimaryButton className="h-[52px] w-full text-[14px]" onClick={closeSheet}>
            계속 이용하기
          </PrimaryButton>
        </div>
      </div>,
    );
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] w-full flex-col bg-[#F6F7FB] pb-8">
        <div 
          className="px-6 pb-6"
          style={{ paddingTop: 'var(--app-top-normal)' }}
        >
          <h1 className="mb-4 text-app-page-title text-textMain">마이페이지</h1>

          {/* 1. 사용자 프로필/게스트 로그인 카드 */}
          {isUnauthenticated ? (
            <div className="mb-6 flex flex-col items-center rounded-[24px] bg-white p-6 text-center shadow-sm">
              <h2 className="mb-2 text-[18px] font-extrabold text-textMain">로그인하고 내 혜택을 관리해보세요</h2>
              <p className="mb-5 break-keep text-[13px] font-medium leading-relaxed text-textSub">
                관심 혜택 저장, 신청 준비 상태 관리,<br />AI 맞춤 추천은 로그인 후 사용할 수 있어요.
              </p>
              <div className="flex w-full flex-col gap-2.5">
                <PrimaryButton onClick={() => navigate('/login')} className="h-[48px] w-full text-[14px]">
                  로그인하기
                </PrimaryButton>
                <button
                  onClick={() => navigate('/register')}
                  className="flex h-[48px] w-full items-center justify-center rounded-full bg-gray-100 text-[14px] font-bold text-textMain active:bg-gray-200"
                >
                  회원가입하기
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-[24px] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleProfilePhotoClick}
                    className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-chipBg text-[24px] font-extrabold text-primary"
                  >
                    {user?.name?.[0]}
                  </button>
                  <button
                    type="button"
                    onClick={handleProfilePhotoClick}
                    className="absolute bottom-0 right-0 flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-white bg-gray-100 text-textSub"
                  >
                    <Camera size={12} />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="text-[20px] font-extrabold text-textMain">{user?.name} 님</h2>
                    <span className="rounded-full bg-chipBg px-2 py-0.5 text-[10px] font-extrabold text-primary">
                      일반 회원
                    </span>
                  </div>
                  <p className="truncate text-[13px] font-semibold text-textSub">
                    {user?.email?.endsWith('@kakao.local')
                      ? '카카오 로그인 연동됨'
                      : user?.email?.endsWith('@naver.local')
                      ? '네이버 로그인 연동됨'
                      : user?.email}
                  </p>
                  {(user?.email?.endsWith('@kakao.local') || user?.email?.endsWith('@naver.local')) && (
                    <p className="mt-1.5 text-[11px] font-semibold text-primary leading-normal max-w-[240px]">
                      소셜 계정으로 가입되었습니다. 알림이나 계정 복구를 위해 이메일을 직접 등록할 수 있습니다.
                    </p>
                  )}
                  <button
                    onClick={() => navigate('/settings/account')}
                    className="mt-3 rounded-full border border-divider px-3 py-1.5 text-[12px] font-bold text-textMain active:bg-gray-50"
                  >
                    프로필 수정
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. 빠른 상태 요약 카드 */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                if (isUnauthenticated) {
                  showToast('로그인 후 이용할 수 있어요.');
                  navigate('/login');
                } else {
                  navigate('/board');
                }
              }}
              className="flex flex-col items-center justify-center rounded-[20px] bg-white p-4 shadow-sm"
            >
              <span className="mb-2 text-[12px] font-bold text-textSub">저장한 혜택</span>
              {isUnauthenticated ? (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-extrabold text-textMuted">
                  로그인 후 확인
                </span>
              ) : (
                <AnimatedNumber value={savedBenefits.length} suffix="건" className="text-[18px] font-extrabold text-primary" />
              )}
            </button>
            <button
              onClick={handleAiProfileClick}
              className="flex flex-col items-center justify-center rounded-[20px] bg-white p-4 shadow-sm"
            >
              <span className="mb-2 text-[12px] font-bold text-textSub">AI 맞춤 프로필</span>
              {isUnauthenticated ? (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-extrabold text-textMuted">
                  로그인 후 설정
                </span>
              ) : (
                <span className={`rounded-full px-2 py-1 text-[11px] font-extrabold ${profile ? 'bg-chipBg text-primary' : 'bg-danger/10 text-danger'}`}>
                  {profile ? '설정 완료' : '설정 필요'}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                if (isUnauthenticated) {
                  showToast('로그인 후 이용할 수 있어요.');
                  navigate('/login');
                } else {
                  navigate('/settings/notifications');
                }
              }}
              className="flex flex-col items-center justify-center rounded-[20px] bg-white p-4 shadow-sm"
            >
              <span className="mb-2 text-[12px] font-bold text-textSub">알림 설정</span>
              {isUnauthenticated ? (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-extrabold text-textMuted">
                  로그인 후 관리
                </span>
              ) : (
                <span className={`rounded-full px-2 py-1 text-[11px] font-extrabold ${hasNotificationSettings ? 'bg-chipBg text-primary' : 'bg-danger/10 text-danger'}`}>
                  {hasNotificationSettings ? '설정됨' : '확인 필요'}
                </span>
              )}
            </button>
          </div>

          {/* 3. 주요 설정 메뉴 */}
          <div className="mb-8">
            <h3 className="mb-3 px-2 text-[13px] font-bold text-textSub">주요 설정</h3>
            <div className="flex flex-col gap-2">
              {MAIN_SETTINGS.map((menu) => (
                <motion.button
                  key={menu.path}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isUnauthenticated) {
                      showToast('로그인 후 이용할 수 있어요.');
                      navigate('/login');
                    } else {
                      navigate(menu.path);
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-[20px] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gray-50">
                      <menu.icon className="text-textSub" size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[15px] font-extrabold text-textMain">{menu.label}</span>
                      <span className="text-[12px] font-medium text-textSub mt-0.5">{menu.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-textMuted" size={20} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* 4. 서비스 안내 메뉴 */}
          <div className="mb-8">
            <h3 className="mb-3 px-2 text-[13px] font-bold text-textSub">서비스 안내</h3>
            <div className="flex flex-col gap-2">
              {SERVICE_INFO.map((menu) => (
                <motion.button
                  key={menu.path}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(menu.path)}
                  className="flex w-full items-center justify-between rounded-[20px] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gray-50">
                      <menu.icon className="text-textSub" size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[15px] font-extrabold text-textMain">{menu.label}</span>
                      <span className="text-[12px] font-medium text-textSub mt-0.5">{menu.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-textMuted" size={20} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* 5. 약관 및 정책 메뉴 */}
          <div className="mb-8">
            <h3 className="mb-3 px-2 text-[13px] font-bold text-textSub">약관 및 정책</h3>
            <div className="flex flex-col gap-2">
              {POLICIES.map((menu) => (
                <motion.button
                  key={menu.path}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(menu.path)}
                  className="flex w-full items-center justify-between rounded-[20px] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gray-50">
                      <menu.icon className="text-textSub" size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[15px] font-extrabold text-textMain">{menu.label}</span>
                      <span className="text-[12px] font-medium text-textSub mt-0.5">{menu.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-textMuted" size={20} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* 로그아웃 버튼 (로그인 시에만) */}
          {!isUnauthenticated && (
            <div className="mb-8">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={confirmLogout}
                className="flex w-full items-center justify-between rounded-[20px] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gray-50">
                    <LogOut className="text-textSub" size={20} />
                  </div>
                  <span className="text-[15px] font-extrabold text-textMain">로그아웃</span>
                </div>
                <ChevronRight className="text-textMuted" size={20} />
              </motion.button>
            </div>
          )}

          {/* 6. 위험 영역 */}
          {!isUnauthenticated && (
            <div className="mt-8 mb-4">
              <button
                type="button"
                onClick={handleWithdrawClick}
                className="w-full rounded-[20px] border border-danger/30 bg-transparent py-4 text-[14px] font-bold text-danger active:bg-danger/5"
              >
                회원 탈퇴
              </button>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
