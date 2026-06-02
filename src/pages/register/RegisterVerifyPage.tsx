import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStepLayout from '../../components/register/RegisterStepLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';
import { useRegisterDraftStore } from '../../store/useRegisterDraftStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { authApi } from '../../api/authApi';

export default function RegisterVerifyPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { setField } = useRegisterDraftStore();
  const { showToast } = useToastStore();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = sessionStorage.getItem('pendingVerificationEmail') || '';

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }
    if (!email) {
      showToast('인증할 이메일 정보를 찾을 수 없습니다. 다시 입력해 주세요.');
      navigate('/register/email', { replace: true });
    }
  }, [isLoggedIn, email, navigate, showToast]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    console.log('[RegisterVerify] resend clicked', { hasEmail: Boolean(email) });

    if (!email) {
      showToast('이메일 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      await authApi.sendEmailVerification(email);
      setTimer(60);
      setCanResend(false);
      showToast('인증번호를 다시 보냈습니다.');
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || '인증번호 재전송에 실패했습니다.';
      showToast(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!email) {
      showToast('인증할 이메일 정보를 찾을 수 없습니다. 다시 입력해 주세요.');
      navigate('/register/email', { replace: true });
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      showToast('6자리 인증번호를 입력해 주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.verifyEmail(email, code);

      if (!response.ok) {
        showToast(response.message || '인증번호가 올바르지 않습니다.');
        return;
      }

      setField('isEmailVerified', true);
      sessionStorage.removeItem('pendingVerificationEmail');
      showToast('이메일 인증이 완료되었습니다.');
      navigate('/register/password', { replace: true });
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || '인증번호가 올바르지 않거나 만료되었습니다.';
      showToast(msg);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterStepLayout
      currentStep={3}
      totalSteps={5}
      title="이메일 확인 단계"
      description={`입력하신 이메일(${email || ''})로 전송된 인증번호를 확인해 주세요.`}
      onBack={() => navigate('/register/email')}
      bottomButton={
        <PrimaryButton onClick={handleVerify} disabled={code.length !== 6 || isLoading}>
          {isLoading ? '확인 중...' : '다음'}
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-[14px] font-semibold text-textSub px-2 leading-relaxed">
          챙김의 안전한 서비스 이용을 위해 수신하신 <strong>6자리 인증번호</strong>를 입력해 주세요.
        </p>

        <Input
          id="email-verification-code"
          name="verificationCode"
          autoComplete="one-time-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full h-14 bg-white border border-divider rounded-2xl px-4 text-[18px] text-textMain text-center tracking-widest font-extrabold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          autoFocus
        />

        <div className="flex justify-between items-center px-2 text-[14px] mt-2">
          <span className="text-textSub font-bold">
            {timer > 0 ? `재전송 가능 대기 ${timer}초` : '인증번호 재요청 가능'}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`font-extrabold underline underline-offset-2 transition-colors ${
              canResend && !isLoading ? 'text-primary' : 'text-textMuted cursor-default'
            }`}
          >
            확인 메일 재요청
          </button>
        </div>
      </div>
    </RegisterStepLayout>
  );
}
