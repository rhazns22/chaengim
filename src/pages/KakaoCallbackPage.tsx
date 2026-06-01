import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import { normalizeErrorMessage } from '../utils/error';

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showToast = useToastStore((state) => state.showToast);
  const loginWithKakao = useAuthStore((state) => state.loginWithKakao);

  // Prevent double execution in React StrictMode
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // 1. Check for Kakao provider level error (e.g., access_denied or user cancel)
      if (error) {
        console.error('Kakao login error:', error, errorDescription);
        showToast(errorDescription || '카카오 로그인이 취소되었습니다.');
        navigate('/login', { replace: true });
        return;
      }

      // 2. Validate Authorization Code presence
      if (!code) {
        showToast('잘못된 접근입니다. 인가코드가 누락되었습니다.');
        navigate('/login', { replace: true });
        return;
      }

      // 3. CSRF Verification: Validate state
      const savedState = sessionStorage.getItem('kakao_oauth_state');
      sessionStorage.removeItem('kakao_oauth_state'); // Clear immediately to prevent reuse

      if (!state || state !== savedState) {
        showToast('보안 검증에 실패했습니다. 안전한 환경에서 다시 시도해 주세요.');
        navigate('/login', { replace: true });
        return;
      }

      try {
        // 4. Exchange Auth Code for Session JWT
        const result = await loginWithKakao(code);
        
        // 5. Successful social auth: Fetch AI profile recommendations settings
        await useAiRecommendationStore.getState().fetchProfile();
        
        // 6. Check setup complete status
        if (result?.needsProfileSetup) {
          showToast('회원가입을 환영합니다! 추가 프로필 설정을 진행합니다.');
          navigate('/profile-setup', { replace: true });
        } else {
          showToast('성공적으로 로그인되었습니다.');
          navigate('/', { replace: true });
        }
      } catch (e: any) {
        const status = e.response?.status;
        const errCode = e.response?.data?.code;
        const errMsg = e.response?.data?.message;

        console.error(`Kakao login failed: [${status}] ${errCode || 'UNKNOWN_ERROR'}`);

        if (status === 409 || errCode === 'KAKAO_LOCAL_ACCOUNT_CONFLICT') {
          showToast(errMsg || '이미 동일한 이메일로 가입된 로컬 계정이 존재합니다. 이메일 로그인으로 먼저 로그인해 주세요.');
        } else if (errCode === 'KAKAO_EMAIL_REQUIRED') {
          showToast(errMsg || '카카오 로그인 시 이메일 제공 및 약관 동의가 필수적입니다.');
        } else if (errCode === 'KAKAO_EMAIL_NOT_VERIFIED') {
          showToast(errMsg || '인증 완료된 카카오 계정 이메일만 가입에 사용될 수 있습니다.');
        } else if (errCode === 'KAKAO_TOKEN_EXCHANGE_FAILED' || errCode === 'KAKAO_PROFILE_FETCH_FAILED') {
          showToast(errMsg || '카카오 서버 연동 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } else {
          showToast(errMsg || normalizeErrorMessage(e) || '카카오 로그인 처리 중 오류가 발생했습니다.');
        }
        
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, loginWithKakao, navigate, showToast]);

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Sleek, pulsing modern 3D-like loader with micro-animation */}
      <div className="relative mb-8 w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-ping"></div>
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="absolute w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
        </div>
      </div>
      
      <h2 className="text-[20px] font-bold text-textMain mb-2">카카오 로그인 중</h2>
      <p className="text-[14px] font-semibold text-textSub">
        안전하게 계정 정보를 확인하고 있습니다.<br />잠시만 기다려 주세요.
      </p>
    </div>
  );
}
