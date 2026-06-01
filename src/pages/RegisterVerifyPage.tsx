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
    <div className="w-full min-h-dvh bg-white flex flex-col relative pb-24">
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
              className="w-full h-14 bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
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
              className="w-full h-14 bg-background border border-divider rounded-[20px] px-4 text-[15px] focus:outline-none focus:border-primary transition-colors text-textMain text-center tracking-widest font-extrabold text-[20px]"
            />
          </>
        )}
      </div>

      <div 
        className="fixed bottom-0 inset-x-0 mx-auto w-full md:max-w-[480px] px-6 pt-6 bg-white border-t border-divider"
        style={{ paddingBottom: 'calc(16px + var(--bottom-safe))' }}
      >
        <PrimaryButton onClick={() => { step === 1 ? setStep(2) : navigate('/register/password') }}>
          {step === 1 ? '인증하기' : '확인 완료'}
        </PrimaryButton>
      </div>
    </div>
  );
}