import { ChevronLeft, LogOut, Mail, Shield, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useBottomSheetStore } from '../store/useBottomSheetStore';
import { useToastStore } from '../store/useToastStore';

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user, isGuest, logout } = useAuthStore();
  const { openSheet, closeSheet } = useBottomSheetStore();
  const showToast = useToastStore((state) => state.showToast);

  const confirmLogout = () => {
    openSheet(
      <div className="flex flex-col items-center">
        <h3 className="mb-2 text-[20px] font-extrabold text-textMain">로그아웃 하시겠어요?</h3>
        <p className="mb-8 text-center text-[15px] font-medium text-textSub">현재 기기에서 계정을 로그아웃합니다.</p>
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
          <PrimaryButton className="w-full bg-chipBg text-textMain shadow-none" onClick={closeSheet}>
            취소
          </PrimaryButton>
        </div>
      </div>,
    );
  };

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-background pb-[calc(120px+env(safe-area-inset-bottom))]">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-divider bg-white/90 px-4 py-4 backdrop-blur-md">
          <button type="button" onClick={() => navigate(-1)} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-extrabold text-textMain">계정 설정</h1>
          <div className="w-10" />
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 rounded-[28px] border border-divider bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-chipBg text-primary">
              <UserRound size={30} />
            </div>
            <h2 className="text-[20px] font-extrabold text-textMain">{user?.name || '게스트'} 님</h2>
            <p className="mt-1 text-[13px] font-semibold text-textSub">
              {user?.email?.endsWith('@kakao.local') ? '카카오 로그인 연동됨' : (user?.email || '로그인 후 계정 정보를 확인할 수 있습니다.')}
            </p>
          </div>

          <div className="mb-5 flex flex-col gap-3">
            <div className="rounded-[24px] border border-divider bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-3">
                <Mail className="text-textSub" size={22} />
                <h3 className="font-extrabold text-textMain">이메일</h3>
              </div>
              <p className="text-[14px] font-medium text-textSub">
                {user?.email?.endsWith('@kakao.local') ? '카카오 로그인 연동됨' : (user?.email || '로그인 정보 없음')}
              </p>
            </div>

            <div className="rounded-[24px] border border-divider bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-3">
                <Shield className="text-textSub" size={22} />
                <h3 className="font-extrabold text-textMain">보안 안내</h3>
              </div>
              <p className="text-[13px] font-medium leading-relaxed text-textSub">
                비밀번호 변경, 회원 탈퇴 같은 계정 변경 기능은 아직 연결되지 않았습니다. 현재 화면에서는 로그인 상태 확인과 로그아웃만 지원합니다.
              </p>
            </div>
          </div>

          {!isGuest && user ? (
            <PrimaryButton className="w-full bg-danger text-white" onClick={confirmLogout}>
              <span className="inline-flex items-center gap-2">
                <LogOut size={18} />
                로그아웃
              </span>
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => navigate('/login')}>로그인하기</PrimaryButton>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
