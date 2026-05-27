const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// SplashPage.tsx
write('src/pages/SplashPage.tsx', `
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../components/common/AppLogo';
import PageTransition from '../components/layout/PageTransition';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageTransition className="w-full min-h-screen bg-primary flex flex-col items-center justify-center relative">
      <div className="flex flex-col items-center">
        <AppLogo white size="lg" className="mb-4" />
        <h1 className="text-[32px] font-extrabold text-white tracking-tight mb-2">챙김</h1>
        <p className="text-app-body font-semibold text-white/80">나를 위한 혜택 한눈에</p>
      </div>
    </PageTransition>
  );
}
`);

// RegisterVerifyPage.tsx
write('src/pages/RegisterVerifyPage.tsx', `
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PrimaryButton from '../components/common/PrimaryButton';

export default function RegisterVerifyPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100dvh] bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={28} className="text-textMain" />
        </button>
      </div>

      <div className="px-6 flex-1 pt-6">
        {step === 1 ? (
          <>
            <h1 className="text-app-page-title text-textMain mb-8">
              인증을 위해<br />전화번호를 입력해주세요.
            </h1>
            <input 
              type="tel" 
              placeholder="010-0000-0000" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
            />
          </>
        ) : (
          <>
            <h1 className="text-app-page-title text-textMain mb-2">
              문자메시지로 보내드린<br />인증번호 6자리를 입력해주세요.
            </h1>
            <p className="text-app-body font-semibold text-textSub mb-8">안내: 123456 입력시 통과</p>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-[15px] focus:outline-none focus:border-primary transition-colors text-textMain text-center tracking-widest font-extrabold text-[20px]"
            />
          </>
        )}
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={() => { step === 1 ? setStep(2) : navigate('/register/password') }}>
          {step === 1 ? '인증하기' : '확인 완료'}
        </PrimaryButton>
      </div>
    </div>
  );
}
`);

// RegisterTermsPage.tsx
write('src/pages/RegisterTermsPage.tsx', `
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PrimaryButton from '../components/common/PrimaryButton';

export default function RegisterTermsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100dvh] bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={28} className="text-textMain" />
        </button>
      </div>

      <div className="px-6 flex-1 pt-6">
        <h1 className="text-app-page-title text-textMain mb-8">
          환영합니다!<br />약관에 동의해주세요.
        </h1>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-primary rounded-xl bg-chipBg">
            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
            <span className="font-extrabold text-textMain text-[15px]">전체 동의하기</span>
          </label>
          <div className="h-px bg-divider my-2"></div>
          <label className="flex items-center gap-3 px-2">
            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-app-body font-semibold text-textMain">(필수) 서비스 이용약관 동의</span>
          </label>
          <label className="flex items-center gap-3 px-2">
            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-app-body font-semibold text-textMain">(필수) 개인정보 수집 및 이용 동의</span>
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={() => navigate('/register/profile')}>다음</PrimaryButton>
      </div>
    </div>
  );
}
`);

// RegisterProfilePage.tsx
write('src/pages/RegisterProfilePage.tsx', `
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PrimaryButton from '../components/common/PrimaryButton';

export default function RegisterProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100dvh] bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={28} className="text-textMain" />
        </button>
      </div>

      <div className="px-6 flex-1 pt-6">
        <h1 className="text-app-page-title text-textMain mb-2">
          반가워요!<br />이름이 어떻게 되시나요?
        </h1>
        <p className="text-app-body font-semibold text-textSub mb-8">정확한 맞춤 혜택을 위해 실명을 입력해주세요.</p>

        <input 
          type="text" 
          placeholder="이름 입력" 
          className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
        />
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={() => navigate('/register/verify')}>입력 완료</PrimaryButton>
      </div>
    </div>
  );
}
`);

// RegisterPasswordPage.tsx
write('src/pages/RegisterPasswordPage.tsx', `
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PrimaryButton from '../components/common/PrimaryButton';

export default function RegisterPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100dvh] bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={28} className="text-textMain" />
        </button>
      </div>

      <div className="px-6 flex-1 pt-6">
        <h1 className="text-app-page-title text-textMain mb-8">
          계정에 사용할<br />비밀번호를 설정해주세요.
        </h1>

        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="비밀번호 입력" 
            className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
          <input 
            type="password" 
            placeholder="비밀번호 확인" 
            className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={() => navigate('/register/complete')}>완료</PrimaryButton>
      </div>
    </div>
  );
}
`);

// OnboardingPage.tsx
write('src/pages/OnboardingPage.tsx', `
import { Link } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import PageTransition from '../components/layout/PageTransition';

export default function OnboardingPage() {
  return (
    <PageTransition className="w-full min-h-screen bg-white flex flex-col items-center justify-center px-6 relative pb-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-20">
        <h1 className="text-[28px] font-extrabold text-textMain mb-4 leading-tight">
          놓치기 쉬운 혜택,<br/>알아서 챙겨드릴게요
        </h1>
        <p className="text-[15px] text-textSub font-semibold">지금 회원가입하고 나에게 딱 맞는<br/>맞춤형 혜택을 받아보세요.</p>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <PrimaryButton onClick={() => window.location.href = '/register/terms'} className="w-full">
          3초만에 시작하기
        </PrimaryButton>
        <div className="flex gap-4 mt-2">
          <Link to="/" className="text-app-body text-textSub hover:text-textMain font-bold">비회원으로 둘러보기</Link>
          <span className="text-divider">|</span>
          <Link to="/login" className="text-app-body text-textSub hover:text-textMain font-bold">로그인하기</Link>
        </div>
      </div>
    </PageTransition>
  );
}
`);

// Toast.tsx
write('src/components/common/Toast.tsx', `
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../store/useToastStore';

export default function Toast() {
  const { isVisible, message } = useToastStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-28 left-1/2 w-[calc(100%-48px)] max-w-[380px] bg-textMain text-white text-[14px] font-bold px-6 py-4 rounded-2xl shadow-float z-[100] text-center"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
`);

console.log('Typo script 4 done.');
