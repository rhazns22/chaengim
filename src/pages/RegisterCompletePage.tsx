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