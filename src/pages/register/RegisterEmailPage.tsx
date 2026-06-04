import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStepLayout from '../../components/register/RegisterStepLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';
import { useRegisterDraftStore } from '../../store/useRegisterDraftStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { authApi } from '../../api/authApi';

export default function RegisterEmailPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { draft, setField } = useRegisterDraftStore();
  const { showToast } = useToastStore();
  const [email, setEmail] = useState(draft.email);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }
    if (!draft.name) {
      navigate('/register', { replace: true }); // 이름 없으면 1단계인 /register로 보냄
    }
  }, [isLoggedIn, draft.name, navigate]);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNext = async () => {
    if (isLoading || !isValid) return;

    const trimmedEmail = email.trim().toLowerCase();
    setField('email', trimmedEmail);
    sessionStorage.setItem('pendingVerificationEmail', trimmedEmail);

    try {
      setIsLoading(true);
      await authApi.sendEmailVerification(trimmedEmail);
      showToast('인증번호를 발송했습니다.');
      navigate('/register/verify');
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      showToast(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterStepLayout
      currentStep={2}
      totalSteps={5}
      title="이메일을 입력해 주세요"
      description="로그인할 때 사용할 이메일이에요."
      onBack={() => navigate('/register')}
      bottomButton={
        <PrimaryButton onClick={handleNext} disabled={!isValid || isLoading}>
          {isLoading ? '발송 중...' : '다음'}
        </PrimaryButton>
      }
    >
      <Input
        id="email"
        name="email"
        autoComplete="email"
        type="email"
        placeholder="example@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-14 bg-white border border-divider rounded-2xl px-4 text-[16px] font-medium text-textMain placeholder:text-textSub outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        autoFocus
      />
    </RegisterStepLayout>
  );
}
