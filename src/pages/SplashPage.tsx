import AppLogo from '../components/common/AppLogo';
import PageTransition from '../components/layout/PageTransition';

export default function SplashPage() {
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