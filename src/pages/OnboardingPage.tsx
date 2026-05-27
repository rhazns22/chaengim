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