import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, LogOut, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import PrimaryButton from '../components/common/PrimaryButton';
import Input from '../components/common/Input';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { user, sendEmailVerification, verifyEmail, logout, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToastStore();

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pendingEmail = sessionStorage.getItem('pendingVerificationEmail');
  const authEmail = user?.email;
  const email = pendingEmail || authEmail;

  // Use a ref to prevent double sending on mount in React 18 StrictMode
  const sentOnMount = useRef(false);

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
      return;
    }

    if (email.endsWith('.local')) {
      navigate('/', { replace: true });
      return;
    }

    // Auto-send verification email on mount
    const triggerAutoSend = async () => {
      if (sentOnMount.current) return;
      sentOnMount.current = true;
      try {
        await sendEmailVerification(email);
        showToast('인증 메일을 발송했습니다.');
      } catch (err: any) {
        setErrorMessage(err.response?.data?.error || err.message || '인증 메일 발송에 실패했습니다.');
      }
    };

    triggerAutoSend();
    clearError();
  }, [email, navigate, sendEmailVerification, showToast, clearError]);

  // Timer Countdown Logic
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend || !email) return;
    try {
      setErrorMessage(null);
      setTimer(60);
      setCanResend(false);
      await sendEmailVerification(email);
      showToast('인증번호를 다시 전송했습니다.');
    } catch (err: any) {
      setCanResend(true);
      setErrorMessage(err.response?.data?.error || err.message || '인증 메일 발송에 실패했습니다.');
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6 || !email) return;
    try {
      setErrorMessage(null);
      await verifyEmail(email, code);
      sessionStorage.removeItem('pendingVerificationEmail');
      showToast('이메일 인증이 완료되었습니다!');
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || '인증 확인에 실패했습니다.';
      setErrorMessage(msg);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('pendingVerificationEmail');
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-[#F6F7FB] flex flex-col justify-between p-6 pt-16">
      {/* Header and Info */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5 animate-pulse">
            <Mail size={32} />
          </div>
          <h1 className="text-[24px] font-extrabold text-textMain tracking-tight">이메일 인증이 필요해요</h1>
          <p className="text-[15px] text-textSub mt-3 leading-relaxed px-4">
            챙김의 안전한 서비스 이용을 위해 가입하신 이메일로 발송된 6자리 인증번호를 입력해 주세요.
          </p>
          <div className="mt-4 px-4 py-2 bg-white rounded-full border border-divider shadow-sm inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <span className="text-[14px] font-bold text-textMain">{email}</span>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl p-6 border border-divider shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-textSub px-1">인증번호 6자리</label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full h-14 text-center text-[22px] tracking-[0.4em] font-black rounded-2xl border border-divider bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:tracking-normal placeholder:font-medium"
              autoFocus
            />
          </div>

          {/* Feedback & Timer */}
          <div className="flex justify-between items-center text-[13px] px-1">
            <span className="font-semibold text-textSub">
              {timer > 0 ? (
                <span className="flex items-center gap-1 text-primary">
                  재전송 대기 {timer}초
                </span>
              ) : (
                '인증번호 재전송이 가능합니다'
              )}
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className={`font-bold flex items-center gap-1.5 underline underline-offset-2 transition-colors ${
                canResend && !isLoading ? 'text-primary hover:text-primaryDark' : 'text-textMuted cursor-default'
              }`}
            >
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              인증번호 재요청
            </button>
          </div>

          {/* Error Message */}
          {(errorMessage || error) && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[14px] text-red-600 font-semibold leading-relaxed">
              {errorMessage || error}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="max-w-md mx-auto w-full flex flex-col gap-4 mt-8">
        <PrimaryButton
          onClick={handleVerify}
          disabled={code.length !== 6 || isLoading}
          className="w-full h-14 font-extrabold text-[16px] rounded-2xl shadow-lg"
        >
          {isLoading ? '인증 확인 중...' : '인증 완료'}
        </PrimaryButton>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-14 bg-white border border-divider rounded-2xl flex items-center justify-center gap-2 text-textSub text-[15px] font-bold shadow-sm active:bg-gray-50 transition-colors"
        >
          <LogOut size={16} />
          로그아웃 후 다른 이메일로 가입
        </button>
      </div>
    </div>
  );
}
