import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import RegisterStepLayout from '../../components/register/RegisterStepLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import Input from '../../components/common/Input';
import { useRegisterDraftStore } from '../../store/useRegisterDraftStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterPasswordPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { draft, passwordVal, setPassword, setField } = useRegisterDraftStore();
  
  const [password, setLocalPassword] = useState(passwordVal);
  const [passwordConfirm, setLocalPasswordConfirm] = useState(draft.passwordConfirm);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }
    if (!draft.isEmailVerified) {
      navigate('/register/verify', { replace: true });
    }
  }, [isLoggedIn, draft.isEmailVerified, navigate]);

  const hasLength = password.length >= 8;
  const hasLettersAndNumbers = /(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
  const isMatch = password === passwordConfirm && password !== '';
  const isValid = hasLength && hasLettersAndNumbers && isMatch;

  const handleNext = () => {
    if (!isValid) return;
    setPassword(password);
    setField('passwordConfirm', passwordConfirm);
    navigate('/register/terms');
  };

  return (
    <RegisterStepLayout
      currentStep={4}
      totalSteps={5}
      title="비밀번호를 설정해 주세요"
      description="8자 이상 영문과 숫자를 조합해 주세요."
      onBack={() => navigate('/register/verify')}
      bottomButton={
        <PrimaryButton onClick={handleNext} disabled={!isValid}>
          다음
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="relative w-full">
          <Input
            id="new-password"
            name="password"
            autoComplete="new-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setLocalPassword(e.target.value)}
            className="w-full h-14 bg-white border border-divider rounded-2xl px-4 text-[16px] font-medium text-textMain placeholder:text-textSub outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 pr-12"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-textSub p-1 hover:text-textMain transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Input
          id="new-password-confirm"
          name="passwordConfirm"
          autoComplete="new-password"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setLocalPasswordConfirm(e.target.value)}
          className="w-full h-14 bg-white border border-divider rounded-2xl px-4 text-[16px] font-medium text-textMain placeholder:text-textSub outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        />

        <div className="flex flex-col gap-2.5 px-2 text-[13px] font-bold mt-1">
          <div className="flex items-center gap-2">
            <span className={hasLength ? 'text-primary' : 'text-textMuted'}>✓</span>
            <span className={hasLength ? 'text-textMain font-bold' : 'text-textSub font-semibold'}>
              8자 이상 입력
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasLettersAndNumbers ? 'text-primary' : 'text-textMuted'}>✓</span>
            <span className={hasLettersAndNumbers ? 'text-textMain font-bold' : 'text-textSub font-semibold'}>
              영문, 숫자 조합
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isMatch ? 'text-primary' : 'text-textMuted'}>✓</span>
            <span className={isMatch ? 'text-textMain font-bold' : 'text-textSub font-semibold'}>
              비밀번호 확인 일치
            </span>
          </div>
        </div>
      </div>
    </RegisterStepLayout>
  );
}
