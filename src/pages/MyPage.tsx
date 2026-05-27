import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, FileText, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useBenefitStore } from '../store/useBenefitStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import { useBottomSheetStore } from '../store/useBottomSheetStore';
import { useToastStore } from '../store/useToastStore';

const menuItems = [
  { icon: Bell, label: '알림 설정', path: '/settings/notifications' },
  { icon: Settings, label: '계정 설정', path: '/settings/account' },
  { icon: Settings, label: 'AI 맞춤 프로필', path: '/settings/profile' },
  { icon: FileText, label: '공지사항', path: '/settings/notices' },
  { icon: FileText, label: '이용약관', path: '/settings/terms' },
  { icon: FileText, label: '개인정보 처리방침', path: '/settings/privacy' },
  { icon: FileText, label: 'AI 추천 안내', path: '/settings/ai-guide' },
];

export default function MyPage() {
  const { user, isGuest, logout } = useAuthStore();
  const navigate = useNavigate();
  const { savedBenefits, fetchSavedBenefits } = useBenefitStore();
  const { profile, fetchProfile } = useAiRecommendationStore();
  const { openSheet, closeSheet } = useBottomSheetStore();
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    if (user && !isGuest) {
      fetchSavedBenefits();
      fetchProfile();
    }
  }, [user, isGuest, fetchSavedBenefits, fetchProfile]);

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

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] w-full flex-col bg-primary">
        <div className="px-6 pb-8 pt-14 text-white">
          <h1 className="mb-2 text-app-page-title text-white">마이페이지</h1>
        </div>

        <div className="flex-1 rounded-t-[44px] bg-white px-6 pb-[calc(120px+env(safe-area-inset-bottom))] pt-8">
          <div className="mb-8 flex items-center gap-4 rounded-[28px] border border-divider bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-chipBg text-[24px] font-extrabold text-primary">
              {user?.name?.[0] || '게'}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="mb-1 text-[20px] font-extrabold text-textMain">{user?.name || '게스트'} 님</h2>
              <p className="truncate text-[13px] font-semibold text-textSub">{user?.email || '로그인해 주세요'}</p>
            </div>
          </div>

          {!isGuest && (
            <div className="mb-8 flex gap-4">
              <div className="flex flex-1 flex-col items-center rounded-[24px] border border-divider bg-white p-4 shadow-sm">
                <span className="mb-1 text-[13px] font-bold text-textSub">저장한 혜택</span>
                <span className="text-[20px] font-extrabold text-primary">{savedBenefits.length}건</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-[24px] border border-divider bg-white p-4 shadow-sm">
                <span className="mb-1 text-[13px] font-bold text-textSub">AI 맞춤 프로필</span>
                <span className={`mt-1 rounded-full px-3 py-1 text-[14px] font-extrabold ${profile ? 'bg-chipBg text-primary' : 'bg-gray-100 text-textSub'}`}>
                  {profile ? '설정완료' : '미설정'}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {menuItems.map((menu) => (
              <motion.button
                key={menu.path}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(menu.path)}
                className="flex w-full items-center justify-between rounded-[24px] border border-divider bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <menu.icon className="text-textSub" size={24} />
                  <span className="text-[16px] font-extrabold text-textMain">{menu.label}</span>
                </div>
                <ChevronRight className="text-textMuted" size={20} />
              </motion.button>
            ))}

            {!isGuest && user ? (
              <>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/settings/withdraw')}
                  className="mt-4 flex w-full items-center justify-between rounded-[24px] border border-divider bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="text-danger" size={24} />
                    <span className="text-[16px] font-extrabold text-danger">회원 탈퇴</span>
                  </div>
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmLogout}
                  className="mt-2 flex w-full items-center justify-between rounded-[24px] border border-divider bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="text-textSub" size={24} />
                    <span className="text-[16px] font-extrabold text-textSub">로그아웃</span>
                  </div>
                </motion.button>
              </>
            ) : (
              <div className="mt-6">
                <PrimaryButton onClick={() => navigate('/login')}>로그인하기</PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
