const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/RegisterPage.tsx': `import { Navigate } from 'react-router-dom';
export default function RegisterPage() { return <Navigate to="/register/terms" replace />; }`,
  
  'src/pages/RegisterTermsPage.tsx': `import { Link } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { ChevronLeft } from 'lucide-react';

export default function RegisterTermsPage() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <Link to="/login" className="p-2 -ml-2"><ChevronLeft size={24} className="text-textMain" /></Link>
      </div>
      <div className="px-6 flex-1 pt-6">
        <h1 className="text-2xl font-bold text-textMain mb-8">환영합니다!<br/>약관에 동의해주세요.</h1>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-primary rounded-xl bg-chipBg">
            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
            <span className="font-bold text-textMain">전체 동의하기</span>
          </label>
          <div className="h-px bg-divider my-2" />
          <label className="flex items-center gap-3 px-2">
            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-textMain">(필수) 서비스 이용약관 동의</span>
          </label>
          <label className="flex items-center gap-3 px-2">
            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-textMain">(필수) 개인정보 수집 및 이용 동의</span>
          </label>
        </div>
      </div>
      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <Link to="/register/profile">
          <PrimaryButton>다음</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}`,

  'src/pages/RegisterProfilePage.tsx': `import { Link } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { ChevronLeft } from 'lucide-react';

export default function RegisterProfilePage() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <Link to="/register/terms" className="p-2 -ml-2"><ChevronLeft size={24} className="text-textMain" /></Link>
      </div>
      <div className="px-6 flex-1 pt-6">
        <h1 className="text-2xl font-bold text-textMain mb-2">반가워요!<br/>이름이 어떻게 되시나요?</h1>
        <p className="text-sm text-textSub mb-8">정확한 맞춤 혜택을 위해 실명을 입력해주세요.</p>
        <input 
          type="text" 
          placeholder="이름 입력" 
          className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-base focus:outline-none focus:border-primary transition-colors text-textMain"
        />
      </div>
      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <Link to="/register/verify">
          <PrimaryButton>입력 완료</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}`,

  'src/pages/RegisterVerifyPage.tsx': `import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function RegisterVerifyPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) setStep(2);
    else navigate('/register/password');
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <Link to="/register/profile" className="p-2 -ml-2"><ChevronLeft size={24} className="text-textMain" /></Link>
      </div>
      <div className="px-6 flex-1 pt-6">
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold text-textMain mb-8">인증을 위해<br/>전화번호를 입력해주세요.</h1>
            <input 
              type="tel" 
              placeholder="010-0000-0000" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-base focus:outline-none focus:border-primary transition-colors text-textMain"
            />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-textMain mb-2">문자메시지로 보내드린<br/>인증번호 6자리를 입력해주세요.</h1>
            <p className="text-sm text-textSub mb-8">안내: 123456 입력시 통과</p>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-base focus:outline-none focus:border-primary transition-colors text-textMain text-center tracking-widest font-bold text-xl"
            />
          </>
        )}
      </div>
      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={handleNext}>{step === 1 ? '인증하기' : '확인 완료'}</PrimaryButton>
      </div>
    </div>
  );
}`,

  'src/pages/RegisterPasswordPage.tsx': `import { Link } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { ChevronLeft } from 'lucide-react';

export default function RegisterPasswordPage() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <Link to="/register/verify" className="p-2 -ml-2"><ChevronLeft size={24} className="text-textMain" /></Link>
      </div>
      <div className="px-6 flex-1 pt-6">
        <h1 className="text-2xl font-bold text-textMain mb-8">계정에 사용할<br/>비밀번호를 설정해주세요.</h1>
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="비밀번호 입력" 
            className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-base focus:outline-none focus:border-primary transition-colors text-textMain"
          />
          <input 
            type="password" 
            placeholder="비밀번호 확인" 
            className="w-full h-14 bg-background border border-divider rounded-xl px-4 text-base focus:outline-none focus:border-primary transition-colors text-textMain"
          />
        </div>
      </div>
      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <Link to="/register/complete">
          <PrimaryButton>완료</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}`,

  'src/pages/RegisterCompletePage.tsx': `import { Link } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';

export default function RegisterCompletePage() {
  const guestLogin = useAuthStore(state => state.guestLogin);
  
  useEffect(() => {
    // 자동 로그인 처리 모의
    guestLogin();
  }, [guestLogin]);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative pb-24">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-4xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-textMain mb-2">가입이 완료되었어요!</h1>
        <p className="text-sm text-textSub">이제 나에게 맞는 혜택을 확인해보세요.</p>
      </div>
      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <Link to="/">
          <PrimaryButton>맞춤 혜택 보러가기</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}`,

  'src/pages/HomePage.tsx': `import { Link } from 'react-router-dom';
import { useBenefitStore } from '../store/useBenefitStore';

export default function HomePage() {
  const benefits = useBenefitStore(state => state.benefits);

  return (
    <div className="w-full bg-primary min-h-screen pb-24">
      <div className="px-6 pt-14 pb-12 text-white relative">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">✓</div>
          <span className="font-bold text-xl tracking-tight">챙김</span>
        </div>
        
        <p className="text-sm text-white/90 mb-2 font-medium">홍길동님을 위한 챙김</p>
        <h1 className="text-2xl font-bold leading-snug mb-8">
          놓치기 쉬운 혜택과 신청 일정을<br />한 번에 챙겨 드릴게요!
        </h1>
        
        <div className="absolute right-6 top-24 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
          🎁
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/80 mb-1">추천혜택</p>
            <p className="text-xl font-bold">8<span className="text-sm font-normal ml-1">건</span></p>
          </div>
          <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/80 mb-1">마감임박</p>
            <p className="text-xl font-bold">0<span className="text-sm font-normal ml-1">건</span></p>
          </div>
          <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/80 mb-1">내 보드</p>
            <p className="text-xl font-bold">3<span className="text-sm font-normal ml-1">건</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-[44px] px-6 pt-8 pb-10 min-h-[500px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button className="w-full bg-primary text-white font-bold h-14 rounded-[26px] shadow-sm mb-10 flex items-center justify-center hover:bg-primaryDark transition-colors">
          맞춤형 혜택 확인하기
        </button>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-textMain">추천 혜택</h2>
            <span className="bg-chipBg text-primary text-xs font-bold px-2 py-0.5 rounded-full">8</span>
          </div>
          <Link to="/benefits" className="text-xs text-textSub font-medium hover:text-textMain">전체보기 {'>'}</Link>
        </div>

        <div className="flex flex-col gap-3">
          {benefits.slice(0, 3).map((benefit) => (
            <Link 
              key={benefit.id} 
              to={\`/benefits/\${benefit.id}\`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-divider hover:shadow-soft transition-shadow min-h-[96px]"
            >
              <div className="w-14 h-14 bg-chipBg rounded-2xl flex flex-shrink-0 items-center justify-center text-2xl">
                {benefit.iconType}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-textMain text-base truncate mb-1">{benefit.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-chipBg text-primary text-[10px] font-bold px-2 py-1 rounded-md">
                    {benefit.category}
                  </span>
                  <p className="text-xs text-textSub truncate">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/benefits" className="text-sm font-bold text-primary hover:text-primaryDark">
            혜택 더 찾아보기
          </Link>
        </div>
      </div>
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim());
});
console.log('Generated register and home pages.');
