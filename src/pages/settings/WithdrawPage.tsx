import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { httpClient as api } from '../../api/httpClient';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isConfirmed = confirmText === '탈퇴합니다';

  const handleWithdraw = async () => {
    if (!isConfirmed) {
      showToast("'탈퇴합니다'를 정확히 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await api.delete('/auth/me');
      // Clear state & localStorage via logout action
      logout();
      showToast('회원 탈퇴가 완료되었습니다.');
      navigate('/login', { replace: true });
    } catch (e: any) {
      showToast(e?.response?.data?.error || '회원 탈퇴 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="ml-2 text-[18px] font-bold text-textMain">회원 탈퇴</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 pb-10">
          {/* 경고 아이콘 + 안내 */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
              <AlertTriangle className="text-danger" size={32} />
            </div>
            <h2 className="mb-2 text-[20px] font-extrabold text-textMain">정말 탈퇴하시겠어요?</h2>
            <p className="text-[14px] leading-relaxed text-textSub">
              탈퇴 시 계정 정보 및 모든 저장 데이터가<br />
              <b>즉시 삭제</b>되며, 복구할 수 없습니다.
            </p>
          </div>

          {/* 삭제 대상 목록 */}
          <div className="mb-8 rounded-[16px] bg-gray-50 p-4">
            <p className="mb-2 text-[13px] font-bold text-textSub">삭제되는 데이터</p>
            <ul className="space-y-1 text-[13px] text-textMuted">
              <li>· 회원 정보 (이메일, 이름)</li>
              <li>· AI 맞춤 프로필</li>
              <li>· 저장한 혜택 및 체크리스트</li>
              <li>· AI 추천 이력</li>
              <li>· 알림 설정</li>
            </ul>
          </div>

          {/* 확인 입력 */}
          <div className="mb-6">
            <label className="mb-2 block text-[14px] font-bold text-textMain">
              탈퇴하시려면 아래에{' '}
              <span className="text-danger">'탈퇴합니다'</span>를 입력해주세요.
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="탈퇴합니다"
              className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain outline-none focus:border-danger"
            />
          </div>

          {/* 탈퇴 버튼 */}
          <PrimaryButton
            className={`w-full transition-colors ${isConfirmed ? 'bg-danger text-white' : 'bg-gray-200 text-gray-400'}`}
            disabled={!isConfirmed || isLoading}
            onClick={handleWithdraw}
          >
            {isLoading ? '처리 중...' : '모든 정보 삭제하고 탈퇴하기'}
          </PrimaryButton>
        </div>
      </div>
    </PageTransition>
  );
}