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
            className="w-full h-14 bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
          <input 
            type="password" 
            placeholder="비밀번호 확인" 
            className="w-full h-14 bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 mx-auto w-full md:max-w-[480px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={() => navigate('/register/complete')}>완료</PrimaryButton>
      </div>
    </div>
  );
}