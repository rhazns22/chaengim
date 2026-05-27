import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { httpClient as api } from '../../api/httpClient';

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [isLoadingName, setIsLoadingName] = useState(false);
  const [isLoadingPw, setIsLoadingPw] = useState(false);

  useEffect(() => {
    // Probe whether this account has a password by checking getMe response
    // We use a lightweight approach: try GET /auth/me and check the server-side flag
    // For now, assume email accounts have password. Social accounts won't have it.
    // We detect by attempting a GET on /auth/me which returns hasPassword flag.
    api.get('/auth/me').then((res) => {
      setHasPassword(res.data.hasPassword ?? true);
    }).catch(() => setHasPassword(false));
  }, []);

  const handleUpdateName = async () => {
    if (!name.trim()) { showToast('이름을 입력해주세요.'); return; }
    setIsLoadingName(true);
    try {
      await api.patch('/auth/me', { name: name.trim() });
      showToast('이름이 변경되었습니다.');
    } catch (e: any) {
      showToast(e?.response?.data?.error || '이름 변경에 실패했습니다.');
    } finally {
      setIsLoadingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      showToast('모든 비밀번호 항목을 입력해주세요.');
      return;
    }
    if (newPassword.length < 8) {
      showToast('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setIsLoadingPw(true);
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      showToast('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e: any) {
      showToast(e?.response?.data?.error || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoadingPw(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-divider bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">계정 설정</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 pb-10">
          {/* 기본 정보 */}
          <div className="mb-8">
            <h2 className="mb-4 text-[16px] font-bold text-textMain">기본 정보</h2>
            <div className="mb-4">
              <label className="mb-1 block text-[13px] text-textSub">이메일</label>
              <input
                disabled
                value={user?.email || ''}
                className="w-full rounded-[16px] border border-divider bg-gray-50 px-4 py-3 text-[15px] text-textMuted outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-[13px] text-textSub">이름</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain outline-none focus:border-primary"
              />
            </div>
            <PrimaryButton onClick={handleUpdateName} disabled={isLoadingName}>
              {isLoadingName ? '저장 중...' : '이름 변경하기'}
            </PrimaryButton>
          </div>

          {/* 비밀번호 변경 */}
          <div>
            <h2 className="mb-4 text-[16px] font-bold text-textMain">비밀번호 변경</h2>
            {hasPassword === false ? (
              <div className="flex items-start gap-3 rounded-[16px] bg-chipBg p-4">
                <Lock size={18} className="mt-0.5 shrink-0 text-textSub" />
                <p className="text-[14px] text-textSub leading-relaxed">
                  소셜 계정으로 가입하셨거나 비밀번호가 설정되어 있지 않아<br />
                  비밀번호 변경을 이용하실 수 없습니다.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="mb-1 block text-[13px] text-textSub">현재 비밀번호</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain outline-none focus:border-primary"
                    placeholder="현재 비밀번호 입력"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-[13px] text-textSub">새 비밀번호</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain outline-none focus:border-primary"
                    placeholder="8자 이상 입력"
                  />
                </div>
                <PrimaryButton onClick={handleUpdatePassword} disabled={isLoadingPw}>
                  {isLoadingPw ? '변경 중...' : '비밀번호 변경하기'}
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}