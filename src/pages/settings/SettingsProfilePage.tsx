import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function SettingsProfilePage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">AI 맞춤 프로필 수정</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="mb-4 text-[15px] text-textSub">
            프로필 설정 페이지로 이동하여<br />
            맞춤 정보를 수정하시겠어요?
          </p>
          <PrimaryButton onClick={() => navigate('/profile-setup')}>프로필 수정하러 가기</PrimaryButton>
        </div>
      </div>
    </PageTransition>
  );
}