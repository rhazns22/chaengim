const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. LoginPage.tsx
write('src/pages/LoginPage.tsx', `
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="w-full min-h-[100dvh] bg-white px-6 py-12 flex flex-col justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-app-page-title text-textMain mb-2">로그인</h1>
        <p className="text-app-body font-semibold text-textSub">놓치기 쉬운 혜택, 알아서 챙겨드릴게요</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mb-8">
        <input 
          type="email" 
          placeholder="이메일" 
          className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
        />
        <PrimaryButton className="mt-6">로그인</PrimaryButton>
      </form>

      <div className="flex justify-center items-center gap-4 text-[14px] font-bold mb-8">
        <Link to="/register/terms" className="text-textSub hover:text-textMain">회원가입</Link>
        <span className="text-divider">|</span>
        <button className="text-textSub hover:text-textMain">비밀번호 찾기</button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-divider"></div>
        <span className="text-[13px] text-textMuted font-bold">또는</span>
        <div className="flex-1 h-px bg-divider"></div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button className="w-full h-14 bg-[#FEE500] text-black font-bold text-[15px] rounded-xl">카카오로 계속하기</button>
        <button className="w-full h-14 bg-white border border-divider text-textMain font-bold text-[15px] rounded-xl">구글로 계속하기</button>
      </div>

      <div className="text-center mt-auto">
        <Link to="/" onClick={guestLogin} className="text-[14px] text-textSub font-bold hover:text-textMain">
          비회원 둘러보기
        </Link>
      </div>
    </div>
  );
}
`);

// 2. RegisterCompletePage.tsx
write('src/pages/RegisterCompletePage.tsx', `
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import PrimaryButton from '../components/common/PrimaryButton';

export default function RegisterCompletePage() {
  const navigate = useNavigate();
  const guestLogin = useAuthStore(state => state.guestLogin);

  const handleStart = () => {
    guestLogin();
    navigate('/');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-white px-6 py-12 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl">🎉</span>
      </div>
      
      <h1 className="text-app-page-title text-textMain mb-4 text-center">
        가입을 환영합니다!
      </h1>
      <p className="text-app-body font-semibold text-textSub text-center mb-12">
        이제 챙김에서 나에게 딱 맞는<br />
        혜택과 일정을 관리해보세요.
      </p>

      <div className="w-full flex flex-col gap-3">
        <PrimaryButton onClick={handleStart}>
          챙김 시작하기
        </PrimaryButton>
        <Link 
          to="/"
          onClick={guestLogin}
          className="w-full h-14 flex items-center justify-center text-[15px] font-bold text-textSub hover:text-textMain transition-colors"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
`);

console.log('Typo script 3 done.');
