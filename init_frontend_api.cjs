const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// Install axios
try {
  execSync('npm install axios', { cwd: __dirname, stdio: 'inherit' });
} catch(e) {}

write('.env.example', `VITE_API_BASE_URL=http://localhost:4000/api`);
write('.env', `VITE_API_BASE_URL=http://localhost:4000/api`);

// Types
write('src/types/benefit.ts', `
export type BenefitCategory =
  | "education"
  | "finance"
  | "startup"
  | "medical"
  | "life"
  | "welfare";

export type Benefit = {
  id: string;
  title: string;
  category: BenefitCategory;
  categoryLabel: string;
  agency: string;
  description: string;
  supportContent: string;
  target: string;
  documents: string;
  applyMethod: string;
  applyUrl?: string;
  deadline?: string;
  isRecommended?: boolean;
  isDeadlineSoon?: boolean;
  iconType: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SavedBenefit = {
  id: string;
  benefitId: string;
  benefit: Benefit;
  status: "preparing" | "applied" | "waiting" | "completed";
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};
`);

// API Client
write('src/api/httpClient.ts', `
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
`);

// Benefit API
write('src/api/benefitApi.ts', `
import { httpClient } from './httpClient';
import type { Benefit } from '../types/benefit';

export const benefitApi = {
  getBenefits: async (params?: { category?: string; q?: string; recommended?: boolean; deadlineSoon?: boolean }): Promise<Benefit[]> => {
    const { data } = await httpClient.get('/benefits', { params });
    return data;
  },
  getBenefitById: async (id: string): Promise<Benefit> => {
    const { data } = await httpClient.get(\`/benefits/\${id}\`);
    return data;
  }
};
`);

// Board API
write('src/api/boardApi.ts', `
import { httpClient } from './httpClient';
import type { SavedBenefit, ChecklistItem } from '../types/benefit';

export const boardApi = {
  getSavedBenefits: async (): Promise<SavedBenefit[]> => {
    const { data } = await httpClient.get('/me/saved-benefits');
    return data;
  },
  saveBenefit: async (benefitId: string): Promise<SavedBenefit> => {
    const { data } = await httpClient.post('/me/saved-benefits', { benefitId });
    return data;
  },
  removeSavedBenefit: async (id: string): Promise<void> => {
    await httpClient.delete(\`/me/saved-benefits/\${id}\`);
  },
  updateStatus: async (id: string, status: string): Promise<SavedBenefit> => {
    const { data } = await httpClient.patch(\`/me/saved-benefits/\${id}/status\`, { status });
    return data;
  },
  updateChecklist: async (id: string, checklist: ChecklistItem[]): Promise<SavedBenefit> => {
    const { data } = await httpClient.patch(\`/me/saved-benefits/\${id}/checklist\`, { checklist });
    return data;
  }
};
`);

// Store Updates
write('src/store/useAuthStore.ts', `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { httpClient } from '../api/httpClient';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async () => {
        try {
          const { data } = await httpClient.post('/auth/login');
          set({ user: data.user, token: data.token });
        } catch (e) {
          console.error('Login failed', e);
        }
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
`);

write('src/store/useBenefitStore.ts', `
import { create } from 'zustand';
import { benefitApi } from '../api/benefitApi';
import { boardApi } from '../api/boardApi';
import { useAuthStore } from './useAuthStore';
import type { Benefit, SavedBenefit } from '../types/benefit';
import { useToastStore } from './useToastStore';

interface BenefitState {
  benefits: Benefit[];
  recommendedBenefits: Benefit[];
  deadlineSoonBenefits: SavedBenefit[];
  savedBenefits: SavedBenefit[];
  selectedBenefit: Benefit | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  fetchBenefits: (params?: { category?: string; q?: string }) => Promise<void>;
  fetchRecommendedBenefits: () => Promise<void>;
  fetchBenefitDetail: (id: string) => Promise<void>;
  fetchSavedBenefits: () => Promise<void>;
  toggleBookmark: (benefitId: string) => Promise<void>;
  clearError: () => void;
}

export const useBenefitStore = create<BenefitState>((set, get) => ({
  benefits: [],
  recommendedBenefits: [],
  deadlineSoonBenefits: [],
  savedBenefits: [],
  selectedBenefit: null,
  isLoading: false,
  isDetailLoading: false,
  isSaving: false,
  error: null,

  fetchBenefits: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await benefitApi.getBenefits(params);
      set({ benefits: data, isLoading: false });
    } catch (e) {
      set({ error: '혜택 목록을 불러오지 못했습니다.', isLoading: false });
    }
  },

  fetchRecommendedBenefits: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await benefitApi.getBenefits({ recommended: true });
      set({ recommendedBenefits: data, isLoading: false });
    } catch (e) {
      set({ error: '추천 혜택을 불러오지 못했습니다.', isLoading: false });
    }
  },

  fetchBenefitDetail: async (id) => {
    set({ isDetailLoading: true, error: null, selectedBenefit: null });
    try {
      const data = await benefitApi.getBenefitById(id);
      set({ selectedBenefit: data, isDetailLoading: false });
    } catch (e) {
      set({ error: '상세 정보를 불러오지 못했습니다.', isDetailLoading: false });
    }
  },

  fetchSavedBenefits: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ savedBenefits: [], deadlineSoonBenefits: [] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const data = await boardApi.getSavedBenefits();
      const deadlineSoon = data.filter(s => s.benefit.deadline);
      set({ savedBenefits: data, deadlineSoonBenefits: deadlineSoon, isLoading: false });
    } catch (e) {
      set({ error: '내 보드 데이터를 불러오지 못했습니다.', isLoading: false });
    }
  },

  toggleBookmark: async (benefitId) => {
    const { token } = useAuthStore.getState();
    const showToast = useToastStore.getState().showToast;
    if (!token) {
      showToast('로그인이 필요한 기능입니다.');
      return;
    }

    set({ isSaving: true });
    const { savedBenefits } = get();
    const existing = savedBenefits.find(s => s.benefitId === benefitId);
    
    try {
      if (existing) {
        await boardApi.removeSavedBenefit(existing.id);
        showToast('혜택 저장을 취소했어요');
      } else {
        await boardApi.saveBenefit(benefitId);
        showToast('내 보드에 혜택을 저장했어요');
      }
      await get().fetchSavedBenefits();
    } catch (e) {
      showToast('오류가 발생했습니다.');
    } finally {
      set({ isSaving: false });
    }
  },

  clearError: () => set({ error: null })
}));
`);

console.log('Frontend APIs done.');
