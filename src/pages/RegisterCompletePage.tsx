import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/common/PrimaryButton';

export default function RegisterCompletePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/profile-setup', { replace: true });
  };

  return (
    <div className="w-full min-h-dvh bg-white px-6 py-12 flex flex-col items-center justify-center">
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
          to="/profile-setup"
          replace
          className="flex h-14 w-full items-center justify-center text-[15px] font-bold text-textSub transition-colors active:text-textMain md:hover:text-textMain"
        >
          건너뛰고 나중에 설정하기
        </Link>
      </div>
    </div>
  );
}