import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, guestLogin, isLoading } = useAuthStore();
  const showToast = useToastStore(state => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    await login({ email, password });
    
    // Check if login was successful
    const state = useAuthStore.getState();
    if (state.isLoggedIn && !state.error) {
      navigate('/', { replace: true });
    } else if (state.error) {
      showToast(state.error);
      useAuthStore.getState().clearError();
    }
  };

  const handleGuestLogin = () => {
    guestLogin();
    navigate('/', { replace: true });
  };

  return (
    <div className="w-full min-h-[100dvh] bg-white px-6 py-12 flex flex-col justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-[28px] font-extrabold text-textMain mb-2">로그인</h1>
        <p className="text-[15px] font-semibold text-textSub">놓치기 쉬운 혜택, 알아서 챙겨드릴게요</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mb-8">
        <input 
          type="email" 
          placeholder="이메일" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[52px] bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[52px] bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
        />
        <PrimaryButton className="mt-6" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </PrimaryButton>
      </form>

      <div className="flex justify-center items-center gap-4 text-[14px] font-bold mb-8">
        <Link to="/register" className="text-textSub hover:text-textMain">회원가입</Link>
        <span className="text-divider">|</span>
        <button className="text-textSub hover:text-textMain">비밀번호 찾기</button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-divider"></div>
        <span className="text-[13px] text-textMuted font-bold">또는</span>
        <div className="flex-1 h-px bg-divider"></div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button type="button" className="w-full h-[52px] bg-[#FEE500] text-black font-bold text-[15px] rounded-[24px]">카카오로 계속하기</button>
        <button type="button" className="w-full h-[52px] bg-white border border-divider text-textMain font-bold text-[15px] rounded-[24px]">구글로 계속하기</button>
      </div>

      <div className="text-center mt-auto">
        <button onClick={handleGuestLogin} className="text-[14px] text-textSub font-bold hover:text-textMain">
          비회원 둘러보기
        </button>
      </div>
    </div>
  );
}