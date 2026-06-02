import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStepLayout from '../../components/register/RegisterStepLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';
import { useRegisterDraftStore } from '../../store/useRegisterDraftStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterNamePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { draft, setField } = useRegisterDraftStore();
  const [name, setName] = useState(draft.name);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const isValid = name.trim().length >= 2;

  const handleNext = () => {
    if (!isValid) return;
    setField('name', name.trim());
    navigate('/register/email');
  };

  return (
    <RegisterStepLayout
      currentStep={1}
      totalSteps={5}
      title="이름을 알려주세요"
      description="챙김에서 사용할 이름이에요."
      onBack={() => navigate('/login')}
      bottomButton={
        <PrimaryButton onClick={handleNext} disabled={!isValid}>
          다음
        </PrimaryButton>
      }
    >
      <Input
        id="name"
        name="name"
        autoComplete="name"
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full h-14 bg-white border border-divider rounded-2xl px-4 text-[16px] font-medium text-textMain placeholder:text-textSub outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        autoFocus
      />
    </RegisterStepLayout>
  );
}
