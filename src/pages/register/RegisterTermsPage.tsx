import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import RegisterStepLayout from '../../components/register/RegisterStepLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useRegisterDraftStore } from '../../store/useRegisterDraftStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { useAiRecommendationStore } from '../../store/useAiRecommendationStore';

export default function RegisterTermsPage() {
  const navigate = useNavigate();
  const { isLoggedIn, register: registerApi, isLoading } = useAuthStore();
  const { showToast } = useToastStore();
  
  const { 
    draft, 
    passwordVal, 
    setField, 
    clearDraft 
  } = useRegisterDraftStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }
    if (!draft.name || !draft.email) {
      navigate('/register', { replace: true });
      return;
    }
    if (!passwordVal) {
      showToast('보안을 위해 비밀번호를 다시 설정해 주세요.');
      navigate('/register/password', { replace: true });
    }
  }, [isLoggedIn, draft.name, draft.email, passwordVal, navigate, showToast]);

  const allAgreed = draft.termsAgreed && draft.privacyAgreed && draft.marketingAgreed;
  const essentialsAgreed = draft.termsAgreed && draft.privacyAgreed;

  const toggleAll = () => {
    const nextVal = !allAgreed;
    setField('termsAgreed', nextVal);
    setField('privacyAgreed', nextVal);
    setField('marketingAgreed', nextVal);
  };

  const handleComplete = async () => {
    if (!essentialsAgreed) return;

    const trimmedName = draft.name.trim();
    const trimmedEmail = draft.email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      showToast('올바른 이름을 입력해 주세요.');
      navigate('/register', { replace: true });
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showToast('올바른 이메일 주소를 입력해 주세요.');
      navigate('/register/email', { replace: true });
      return;
    }

    if (!passwordVal || passwordVal.length < 8) {
      showToast('비밀번호 보안 단계가 유효하지 않습니다. 다시 설정해 주세요.');
      navigate('/register/password', { replace: true });
      return;
    }

    await registerApi({
      name: trimmedName,
      email: trimmedEmail,
      password: passwordVal,
    });

    const state = useAuthStore.getState();
    if (state.isLoggedIn && !state.error) {
      clearDraft(); // 가입 성공 후 임시 임포트 정보 정리
      await useAiRecommendationStore.getState().fetchProfile();
      navigate('/register/complete', { replace: true });
    } else if (state.error) {
      showToast(state.error);
      useAuthStore.getState().clearError();
    }
  };

  return (
    <RegisterStepLayout
      currentStep={5}
      totalSteps={5}
      isTerms={true}
      title="약관에 동의해 주세요"
      description="서비스 이용을 위해 필수 약관 동의가 필요해요."
      onBack={() => navigate('/register/password')}
      bottomButton={
        <PrimaryButton 
          onClick={handleComplete} 
          disabled={!essentialsAgreed || isLoading}
        >
          {isLoading ? '가입 완료 처리 중...' : '동의하고 가입 완료'}
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-6">
        {/* 전체 동의 버튼 카드 */}
        <button
          type="button"
          onClick={toggleAll}
          className={`flex items-center gap-4 w-full p-5 border rounded-[24px] transition-colors text-left ${
            allAgreed 
              ? 'border-primary bg-chipBg text-primary' 
              : 'border-divider bg-white text-textMain shadow-sm'
          }`}
        >
          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
            allAgreed ? 'border-primary bg-primary text-white' : 'border-textMuted/40 bg-white text-transparent'
          }`}>
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="font-extrabold text-[16px]">전체 동의하기</span>
        </button>

        {/* 개별 체크 리스트 */}
        <div className="flex flex-col gap-5 px-1.5 mt-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setField('termsAgreed', !draft.termsAgreed)}
              className="flex items-center gap-3.5 text-left min-h-[40px] flex-1"
            >
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                draft.termsAgreed ? 'border-primary bg-primary text-white' : 'border-textMuted/30 bg-white text-transparent'
              }`}>
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="text-[15px] font-semibold text-textMain">[필수] 서비스 이용약관 동의</span>
            </button>
            <Link to="/settings/terms" className="text-[13px] font-bold text-textMuted underline underline-offset-2 pr-1">
              보기
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setField('privacyAgreed', !draft.privacyAgreed)}
              className="flex items-center gap-3.5 text-left min-h-[40px] flex-1"
            >
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                draft.privacyAgreed ? 'border-primary bg-primary text-white' : 'border-textMuted/30 bg-white text-transparent'
              }`}>
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="text-[15px] font-semibold text-textMain">[필수] 개인정보 수집 및 이용 동의</span>
            </button>
            <Link to="/settings/privacy" className="text-[13px] font-bold text-textMuted underline underline-offset-2 pr-1">
              보기
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setField('marketingAgreed', !draft.marketingAgreed)}
              className="flex items-center gap-3.5 text-left min-h-[40px] flex-1"
            >
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                draft.marketingAgreed ? 'border-primary bg-primary text-white' : 'border-textMuted/30 bg-white text-transparent'
              }`}>
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="text-[15px] font-semibold text-textMain">[선택] 마케팅 정보 수신 동의</span>
            </button>
          </div>
        </div>
      </div>
    </RegisterStepLayout>
  );
}
