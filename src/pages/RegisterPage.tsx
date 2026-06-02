import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import PrimaryButton from '../components/common/PrimaryButton';
import Input from '../components/common/Input';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import AppLogo from '../components/common/AppLogo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, guestLogin, isLoading } = useAuthStore();
  const showToast = useToastStore(state => state.showToast);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Validation
  const errors = useMemo(() => {
    const err: Record<string, string> = {};
    if (form.name && form.name.length < 2) err.name = '이름은 2자 이상이어야 해요.';
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = '올바른 이메일 형식이 아니에요.';
    }

    if (form.password) {
      if (form.password.length < 8) {
        err.password = '비밀번호는 8자 이상이어야 해요.';
      } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(form.password)) {
        err.password = '영문과 숫자를 모두 포함해야 해요.';
      }
    }

    if (form.passwordConfirm && form.password !== form.passwordConfirm) {
      err.passwordConfirm = '비밀번호가 일치하지 않아요.';
    }

    return err;
  }, [form]);

  const isValid = 
    form.name.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.length >= 8 &&
    /(?=.*[a-zA-Z])(?=.*[0-9])/.test(form.password) &&
    form.password === form.passwordConfirm &&
    termsAgreed &&
    privacyAgreed;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuestLogin = () => {
    guestLogin();
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    await register({ name: form.name, email: form.email, password: form.password });
    
    const state = useAuthStore.getState();
    if (state.isLoggedIn && !state.error) {
      sessionStorage.setItem('pendingVerificationEmail', form.email);
      navigate('/register/complete', { replace: true });
    } else if (state.error) {
      showToast(state.error);
      useAuthStore.getState().clearError();
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#F6F7FB] pb-[140px]">
      <div className="sticky top-0 z-10 flex h-14 items-center bg-[#F6F7FB]/90 px-4 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="-ml-2 rounded-full p-2 transition-colors active:bg-gray-100">
          <ChevronLeft size={28} className="text-textMain" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-4">
        <div className="mb-4">
          <AppLogo size="md" />
        </div>
        <h1 className="mb-2 text-[26px] font-extrabold leading-[1.3] text-textMain">
          챙김에 오신 것을<br />환영합니다!
        </h1>
        <p className="mb-8 text-[15px] font-semibold text-textSub">기본 정보를 입력해주세요.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            type="text" 
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름 (실명)" 
            error={errors.name}
          />
          <Input 
            type="email" 
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일 주소" 
            error={errors.email}
          />
          <Input 
            type="password" 
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호" 
            error={errors.password}
            helperText="비밀번호는 8자 이상, 영문과 숫자를 포함해주세요."
          />
          <Input 
            type="password" 
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호 확인" 
            error={errors.passwordConfirm}
          />
          
          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white shadow-sm p-5">
            <label className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTermsAgreed(!termsAgreed)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  termsAgreed ? 'border-primary bg-primary text-white' : 'border-divider bg-white text-transparent'
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <div className="flex flex-1 items-center justify-between text-[14px]">
                <span className="font-semibold text-textMain">[필수] 이용약관 동의</span>
                <Link to="/settings/terms" className="font-bold text-textMuted underline underline-offset-2 transition-colors active:text-textSub md:hover:text-textSub">보기</Link>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPrivacyAgreed(!privacyAgreed)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  privacyAgreed ? 'border-primary bg-primary text-white' : 'border-divider bg-white text-transparent'
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <div className="flex flex-1 items-center justify-between text-[14px]">
                <span className="font-semibold text-textMain">[필수] 개인정보 처리방침 동의</span>
                <Link to="/settings/privacy" className="font-bold text-textMuted underline underline-offset-2 transition-colors active:text-textSub md:hover:text-textSub">보기</Link>
              </div>
            </label>
          </div>
        </form>
      </div>

      <div 
        className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full md:max-w-[480px] bg-[#F6F7FB] px-6 pt-4"
        style={{ paddingBottom: 'calc(16px + var(--bottom-safe))' }}
      >
        <div className="mb-4 flex items-center justify-center gap-4 text-[13px] font-bold">
          <Link to="/login" className="text-textSub transition-colors active:text-textMain md:hover:text-textMain">이미 계정이 있으신가요? 로그인</Link>
          <div className="h-3 w-px bg-divider" />
          <button onClick={handleGuestLogin} className="text-textSub transition-colors active:text-textMain md:hover:text-textMain">가입 없이 둘러보기</button>
        </div>
        <PrimaryButton onClick={handleSubmit} disabled={!isValid || isLoading}>
          {isLoading ? '가입 중...' : '가입 완료'}
        </PrimaryButton>
      </div>
    </div>
  );
}