import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStepLayout from '../../components/register/RegisterStepLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';
import { useRegisterDraftStore } from '../../store/useRegisterDraftStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterEmailPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { draft, setField } = useRegisterDraftStore();
  const [email, setEmail] = useState(draft.email);

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

  const handleNext = () => {
    if (!isValid) return;
    setField('email', email.trim());
    
    // TODO: 백엔드 이메일 중복 확인 API가 연동될 경우 여기에 호출부를 구성합니다.
    // 현재는 이메일 중복이 없는 것으로 가정하고 인증코드 화면으로 이동합니다.
    navigate('/register/verify');
  };

  return (
    <RegisterStepLayout
      currentStep={2}
      totalSteps={5}
      title="이메일을 입력해 주세요"
      description="로그인할 때 사용할 이메일이에요."
      onBack={() => navigate('/register')}
      bottomButton={
        <PrimaryButton onClick={handleNext} disabled={!isValid}>
          다음
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
