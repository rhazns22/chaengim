import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import AppLogo from '../components/common/AppLogo';

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
      await useAiRecommendationStore.getState().fetchProfile();
      const needsProfile = useAiRecommendationStore.getState().needsProfileSetup;
      
      if (needsProfile) {
        navigate('/profile-setup', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else if (state.error) {
      showToast(state.error);
      useAuthStore.getState().clearError();
    }
  };

  const handleGuestLogin = () => {
    guestLogin();
    navigate('/', { replace: true });
  };

  const handleKakaoLogin = () => {
    const KAKAO_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    if (!KAKAO_KEY || !REDIRECT_URI) {
      showToast('카카오 로그인 설정이 완료되지 않았습니다.');
      return;
    }

    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('kakao_oauth_state', state);

    window.location.href = `https://kauth.kakao.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(KAKAO_KEY)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&state=${encodeURIComponent(state)}` +
      `&scope=${encodeURIComponent('profile_nickname,profile_image')}`;
  };

  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
    const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;

    if (!NAVER_CLIENT_ID || !NAVER_REDIRECT_URI) {
      showToast('네이버 로그인 설정이 완료되지 않았습니다.');
      return;
    }

    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('naver_oauth_state', state);

    window.location.href = `https://nid.naver.com/oauth2.0/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(NAVER_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}` +
      `&state=${encodeURIComponent(state)}`;
  };

  return (
    <div
      className="min-h-dvh bg-white overflow-x-hidden px-6 flex flex-col justify-start relative w-full"
      style={{
        paddingTop: 'clamp(56px, calc(var(--safe-top) + 8vh), 96px)',
        paddingBottom: 'calc(32px + var(--bottom-safe))',
      }}
    >
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-6">
          <AppLogo size="lg" />
        </div>
        <h1 className="mb-3 text-[30px] font-extrabold text-textMain leading-tight">로그인</h1>
        <p className="text-[15px] font-semibold text-textSub">놓치기 쉬운 혜택, 알아서 챙겨드릴게요</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mb-10">
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
        <Link to="/register" className="text-textSub transition-colors active:text-textMain md:hover:text-textMain">회원가입</Link>
        <span className="text-divider">|</span>
        <button className="text-textSub transition-colors active:text-textMain md:hover:text-textMain">비밀번호 찾기</button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-divider"></div>
        <span className="text-[13px] text-textMuted font-bold">또는</span>
        <div className="flex-1 h-px bg-divider"></div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button 
          type="button" 
          onClick={handleKakaoLogin}
          className="w-full h-[52px] bg-[#FEE500] text-black font-bold text-[15px] rounded-[24px] flex items-center justify-center gap-2.5 active:bg-[#E5CD00] transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.922-.12.483.178.478.374.346.155-.103 2.443-1.66 3.429-2.316.896.243 1.84.375 2.808.375 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z"/>
          </svg>
          카카오로 계속하기
        </button>
        <button 
          type="button" 
          onClick={handleNaverLogin}
          className="w-full h-[52px] bg-[#03C75A] text-white font-bold text-[15px] rounded-[24px] flex items-center justify-center gap-2.5 active:bg-[#02a94c] transition-colors"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-0.5">
            <path d="M16.2 3H21v18h-4.8l-8.4-12V21H3V3h4.8l8.4 12V3z"/>
          </svg>
          네이버로 계속하기
        </button>
        <button 
          type="button" 
          className="w-full h-[52px] bg-white border border-divider text-textMain font-bold text-[15px] rounded-[24px] flex items-center justify-center gap-2.5 active:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          구글로 계속하기
        </button>
      </div>

      <div className="text-center mt-auto">
        <button onClick={handleGuestLogin} className="text-[14px] font-bold text-textSub transition-colors active:text-textMain md:hover:text-textMain">
          비회원 둘러보기
        </button>
      </div>
    </div>
  );
}