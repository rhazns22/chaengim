const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/SplashPage.tsx': `import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-primary flex flex-col items-center justify-center text-white animate-pulse">
      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold mb-4">✓</div>
      <h1 className="text-3xl font-bold mb-2">챙김</h1>
      <p className="text-sm text-white/80">나를 위한 혜택 한눈에</p>
    </div>
  );
}`,

  'src/pages/OnboardingPage.tsx': `import { Link } from 'react-router-dom';

export default function OnboardingPage() {
  return (
    <div className="w-full min-h-screen bg-primary flex flex-col relative">
      <div className="flex-1 flex flex-col items-center justify-center text-white pb-20">
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">✓</div>
        <h1 className="text-3xl font-bold mb-2 text-center leading-snug">
          챙김과 함께<br />혜택을 시작해볼까요?
        </h1>
      </div>
      
      <div className="bg-white rounded-t-[44px] p-6 pt-10 pb-12 shadow-float flex flex-col gap-4">
        <button className="w-full bg-white border border-divider text-textMain font-bold h-14 rounded-2xl shadow-sm flex items-center justify-center gap-2">
          구글 계정으로 시작하기
        </button>
        <button className="w-full bg-[#FEE500] text-[#000000] font-bold h-14 rounded-2xl shadow-sm flex items-center justify-center gap-2">
          카카오톡으로 시작하기
        </button>
        <Link to="/login" className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-sm flex items-center justify-center gap-2">
          이메일로 시작하기
        </Link>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Link to="/" className="text-sm text-textSub hover:text-textMain font-medium">비회원으로 둘러보기</Link>
          <span className="text-divider">|</span>
          <Link to="/login" className="text-sm text-textSub hover:text-textMain font-medium">로그인하기</Link>
        </div>
      </div>
    </div>
  );
}`,

  'src/pages/LoginPage.tsx': `import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const guestLogin = useAuthStore(state => state.guestLogin);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    guestLogin();
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 py-12 flex flex-col justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-textMain mb-2">로그인</h1>
        <p className="text-textSub text-sm">놓치기 쉬운 혜택, 알아서 챙겨드릴게요</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mb-8">
        <input 
          type="email" 
          placeholder="이메일" 
          className="w-full h-12 bg-background border border-divider rounded-xl px-4 text-sm focus:outline-none focus:border-primary transition-colors text-textMain"
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          className="w-full h-12 bg-background border border-divider rounded-xl px-4 text-sm focus:outline-none focus:border-primary transition-colors text-textMain"
        />
        <PrimaryButton type="submit" className="mt-6 rounded-xl">로그인</PrimaryButton>
      </form>

      <div className="flex justify-center items-center gap-4 text-sm font-medium mb-8">
        <Link to="/register/terms" className="text-textSub hover:text-textMain">회원가입</Link>
        <span className="text-divider">|</span>
        <button className="text-textSub hover:text-textMain">비밀번호 찾기</button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-divider"></div>
        <span className="text-xs text-textMuted font-medium">또는</span>
        <div className="flex-1 h-px bg-divider"></div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button className="w-full h-12 bg-[#FEE500] text-black font-medium rounded-xl">카카오로 계속하기</button>
        <button className="w-full h-12 bg-white border border-divider text-textMain font-medium rounded-xl">구글로 계속하기</button>
      </div>

      <div className="text-center mt-auto">
        <Link to="/" onClick={guestLogin} className="text-sm text-textSub font-medium hover:text-textMain">
          비회원 둘러보기
        </Link>
      </div>
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim());
});
console.log('Generated auth pages.');
