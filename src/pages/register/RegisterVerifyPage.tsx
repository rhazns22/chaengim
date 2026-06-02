import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStepLayout from '../../components/register/RegisterStepLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';
import { useRegisterDraftStore } from '../../store/useRegisterDraftStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterVerifyPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { draft, setField } = useRegisterDraftStore();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }
    if (!draft.email) {
      navigate('/register/email', { replace: true });
    }
  }, [isLoggedIn, draft.email, navigate]);

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

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    // TODO: 실제 백엔드에 이메일 발송 API 연동 시 호출 부를 구성합니다.
  };

  const handleNext = () => {
    if (code.length !== 6) return;
    
    // TODO: 백엔드에 실제 이메일 발송 및 인증 확인 API가 추가되면 검증 로직을 도입해야 합니다.
    // 현재 베타 모드 상태에서는 임의의 숫자 6자리 입력 시 형식 단계 통과로 간주합니다.
    setField('isEmailVerified', true);
    navigate('/register/password');
  };

  return (
    <RegisterStepLayout
      currentStep={3}
      totalSteps={5}
      title="이메일 확인 단계"
      description={`입력하신 이메일(${draft.email || ''})이 올바른지 확인해 주세요.`}
      onBack={() => navigate('/register/email')}
      bottomButton={
        <PrimaryButton onClick={handleNext} disabled={code.length !== 6}>
          다음
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-[14px] font-semibold text-textSub px-2 leading-relaxed">
          베타 서비스 기간 동안에는 이메일 형식 확인만 진행하며, 아래 입력 칸에 <strong>임의의 숫자 6자리</strong>를 입력하시면 즉시 다음 단계로 이동합니다.
        </p>

        <Input
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
            disabled={!canResend}
            className={`font-extrabold underline underline-offset-2 transition-colors ${
              canResend ? 'text-primary' : 'text-textMuted cursor-default'
            }`}
          >
            확인 메일 재요청
          </button>
        </div>
      </div>
    </RegisterStepLayout>
  );
}
