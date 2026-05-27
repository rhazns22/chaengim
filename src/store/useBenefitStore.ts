import { create } from 'zustand';
import { benefitApi, type BenefitListParams } from '../api/benefitApi';
import { boardApi } from '../api/boardApi';
import { useAuthStore } from './useAuthStore';
import type { Benefit, SavedBenefit } from '../types/benefit';
import { useToastStore } from './useToastStore';
import { normalizeErrorMessage } from '../utils/error';

interface BenefitState {
  benefits: Benefit[];
  recommendedBenefits: Benefit[];
  benefitPage: number;
  benefitLimit: number;
  benefitTotal: number;
  benefitHasNext: boolean;
  deadlineSoonBenefits: SavedBenefit[];
  savedBenefits: SavedBenefit[];
  selectedBenefit: Benefit | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  fetchBenefits: (params?: BenefitListParams & { append?: boolean }) => Promise<void>;
  fetchRecommendedBenefits: () => Promise<void>;
  fetchBenefitDetail: (id: string) => Promise<void>;
  fetchSavedBenefits: () => Promise<void>;
  toggleBookmark: (benefitId: string) => Promise<void>;
  clearError: () => void;
}

export const useBenefitStore = create<BenefitState>((set, get) => ({
  benefits: [],
  recommendedBenefits: [],
  benefitPage: 1,
  benefitLimit: 20,
  benefitTotal: 0,
  benefitHasNext: false,
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
      set((state) => ({
        benefits: params?.append ? [...state.benefits, ...data.items] : data.items,
        benefitPage: data.page,
        benefitLimit: data.limit,
        benefitTotal: data.total,
        benefitHasNext: data.hasNext,
        isLoading: false,
      }));
    } catch (e: unknown) {
      set({ error: normalizeErrorMessage(e), isLoading: false });
    }
  },

  fetchRecommendedBenefits: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await benefitApi.getBenefits({ recommended: true, limit: 3 });
      const fallback = data.items.length > 0 ? data : await benefitApi.getBenefits({ limit: 3 });
      set({ recommendedBenefits: fallback.items, isLoading: false });
    } catch (e: unknown) {
      set({ error: normalizeErrorMessage(e), recommendedBenefits: [], isLoading: false });
    }
  },

  fetchBenefitDetail: async (id) => {
    set({ isDetailLoading: true, error: null, selectedBenefit: null });
    try {
      const data = await benefitApi.getBenefitById(id);
      set({ selectedBenefit: data, isDetailLoading: false });
    } catch (e: unknown) {
      set({ error: normalizeErrorMessage(e), isDetailLoading: false });
    }
  },

  fetchSavedBenefits: async () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      set({ savedBenefits: [], deadlineSoonBenefits: [] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const data = await boardApi.getSavedBenefits();
      const deadlineSoon = data.filter(s => s.benefit.deadline);
      set({ savedBenefits: data, deadlineSoonBenefits: deadlineSoon, isLoading: false });
    } catch (e: unknown) {
      set({ error: normalizeErrorMessage(e), isLoading: false });
    }
  },

  toggleBookmark: async (benefitId) => {
    const { accessToken: token } = useAuthStore.getState();
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
    } catch (e: unknown) {
      showToast(normalizeErrorMessage(e));
    } finally {
      set({ isSaving: false });
    }
  },

  clearError: () => set({ error: null })
}));
