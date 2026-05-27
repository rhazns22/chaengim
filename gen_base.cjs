const fs = require('fs');
const path = require('path');

const files = {
  'src/app/App.tsx': `import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return <RouterProvider router={router} />;
}`,

  'src/app/router.tsx': `import { createBrowserRouter } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import SplashPage from '../pages/SplashPage';
import OnboardingPage from '../pages/OnboardingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RegisterTermsPage from '../pages/RegisterTermsPage';
import RegisterProfilePage from '../pages/RegisterProfilePage';
import RegisterVerifyPage from '../pages/RegisterVerifyPage';
import RegisterPasswordPage from '../pages/RegisterPasswordPage';
import RegisterCompletePage from '../pages/RegisterCompletePage';
import HomePage from '../pages/HomePage';
import BenefitsPage from '../pages/BenefitsPage';
import BenefitDetailPage from '../pages/BenefitDetailPage';
import BoardPage from '../pages/BoardPage';
import SchedulePage from '../pages/SchedulePage';
import MyPage from '../pages/MyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileShell />,
    children: [
      { path: 'splash', element: <SplashPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'register/terms', element: <RegisterTermsPage /> },
      { path: 'register/profile', element: <RegisterProfilePage /> },
      { path: 'register/verify', element: <RegisterVerifyPage /> },
      { path: 'register/password', element: <RegisterPasswordPage /> },
      { path: 'register/complete', element: <RegisterCompletePage /> },
      { index: true, element: <HomePage /> },
      { path: 'benefits', element: <BenefitsPage /> },
      { path: 'benefits/:id', element: <BenefitDetailPage /> },
      { path: 'board', element: <BoardPage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'mypage', element: <MyPage /> },
    ]
  }
]);`,

  'src/types/benefit.ts': `export interface Benefit {
  id: string;
  title: string;
  category: string;
  agency: string;
  description: string;
  supportContent: string;
  target: string;
  documents: string;
  applyMethod: string;
  deadline?: string;
  status?: string;
  isBookmarked: boolean;
  iconType: string;
}`,

  'src/types/user.ts': `export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}`,

  'src/data/benefits.ts': `import type { Benefit } from '../types/benefit';

export const mockBenefits: Benefit[] = [
  {
    id: '1',
    title: '국민내일배움카드',
    category: '교육',
    agency: '고용노동부',
    description: '취업을 준비하는 청년 및 구직자의 직업 훈련비용 지원',
    supportContent: '직업 훈련비용을 최대 500만원까지 지원하는 제도입니다.',
    target: '취업을 준비하는 청년 및 구직자',
    documents: '신분증, 구직등록필증',
    applyMethod: 'HRD-Net 홈페이지 신청 또는 고용센터 방문',
    isBookmarked: false,
    iconType: '📘',
  },
  {
    id: '2',
    title: '중소기업 취직 청년 소득세 감면',
    category: '금융',
    agency: '국세청',
    description: '중소기업에 취업한 청년의 소득세를 5년간 최대 90%까지 감면',
    supportContent: '매년 최대 200만원 한도 내에서 소득세 90% 감면',
    target: '만 15세 ~ 34세 이하 중소기업 취업 청년',
    documents: '감면신청서, 주민등록등본, 원천징수영수증',
    applyMethod: '회사에 감면신청서 제출',
    isBookmarked: true,
    iconType: '💰',
  },
  {
    id: '3',
    title: '청년 창업 지원금',
    category: '창업',
    agency: '중소벤처기업부',
    description: '청년 창업가에게 사업화 자금 및 교육, 멘토링 지원',
    supportContent: '최대 1억원의 창업 사업화 자금 및 멘토링 지원',
    target: '만 39세 이하 예비 창업자 또는 초기 창업자',
    documents: '사업계획서, 주민등록등본',
    applyMethod: 'K-Startup 홈페이지 온라인 신청',
    deadline: '2026-06-30',
    status: '진행중',
    isBookmarked: true,
    iconType: '🚀',
  },
  {
    id: '4',
    title: '청년 월세 지원',
    category: '주거',
    agency: '국토교통부',
    description: '저소득 독립 청년에게 최대 20만원씩 12개월간 월세 지원',
    supportContent: '월 최대 20만원 지원 (12개월)',
    target: '만 19세~34세 무주택 청년 (소득요건 충족시)',
    documents: '가족관계증명서, 임대차계약서, 통장사본',
    applyMethod: '복지로 온라인 신청 또는 관할 주민센터 방문',
    deadline: '2026-07-15',
    isBookmarked: false,
    iconType: '🏠',
  },
];`,

  'src/store/useAuthStore.ts': `import { create } from 'zustand';
import type { User } from '../types/user';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  guestLogin: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
  guestLogin: () => set({ isLoggedIn: true, user: { id: 'guest', name: '게스트', email: 'guest@example.com' } }),
}));`,

  'src/store/useBenefitStore.ts': `import { create } from 'zustand';
import type { Benefit } from '../types/benefit';
import { mockBenefits } from '../data/benefits';

interface BenefitState {
  benefits: Benefit[];
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
}

export const useBenefitStore = create<BenefitState>((set) => ({
  benefits: mockBenefits,
  bookmarkedIds: mockBenefits.filter(b => b.isBookmarked).map(b => b.id),
  toggleBookmark: (id) => set((state) => {
    const isBookmarked = state.bookmarkedIds.includes(id);
    const newBookmarks = isBookmarked
      ? state.bookmarkedIds.filter(bid => bid !== id)
      : [...state.bookmarkedIds, id];
      
    const newBenefits = state.benefits.map(b => 
      b.id === id ? { ...b, isBookmarked: !isBookmarked } : b
    );
      
    return { bookmarkedIds: newBookmarks, benefits: newBenefits };
  }),
}));`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim());
});
console.log('Generated base config and store files.');
