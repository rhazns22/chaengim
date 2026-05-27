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
          className="w-full h-14 bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
        />
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={() => navigate('/register/verify')}>입력 완료</PrimaryButton>
      </div>
    </div>
  );
}