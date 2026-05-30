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
          <label className="flex items-center gap-3 p-4 border border-primary rounded-[24px] bg-chipBg">
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

      <div className="fixed bottom-0 inset-x-0 mx-auto w-full md:max-w-[480px] p-6 bg-white border-t border-divider">
        <PrimaryButton onClick={() => navigate('/register/profile')}>다음</PrimaryButton>
      </div>
    </div>
  );
}