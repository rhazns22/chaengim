import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const showToast = useToastStore(state => state.showToast);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, passwordConfirm } = form;

    if (!name || !email || !password || !passwordConfirm) {
      showToast('모든 항목을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (password.length < 8) {
      showToast('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      showToast('비밀번호가 일치하지 않습니다.');
      return;
    }

    await register({ name, email, password });
    
    const state = useAuthStore.getState();
    if (state.isLoggedIn && !state.error) {
      navigate('/register/complete', { replace: true });
    } else if (state.error) {
      showToast(state.error);
      useAuthStore.getState().clearError();
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-white flex flex-col relative pb-24">
      <div className="flex items-center h-14 px-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={28} className="text-textMain" />
        </button>
      </div>

      <div className="px-6 flex-1 pt-6">
        <h1 className="text-[26px] font-extrabold text-textMain mb-2 leading-[1.3]">
          챙김에 오신 것을<br />환영합니다!
        </h1>
        <p className="text-[15px] font-semibold text-textSub mb-8">기본 정보를 입력해주세요.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름 (실명)" 
            className="w-full h-[52px] bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
          <input 
            type="email" 
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일 주소" 
            className="w-full h-[52px] bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
          <input 
            type="password" 
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호 (8자 이상)" 
            className="w-full h-[52px] bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
          <input 
            type="password" 
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호 확인" 
            className="w-full h-[52px] bg-background border border-divider rounded-[20px] px-4 text-[15px] font-semibold focus:outline-none focus:border-primary transition-colors text-textMain"
          />
          
          <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-white border-t border-divider z-20">
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? '가입 중...' : '가입 완료'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}