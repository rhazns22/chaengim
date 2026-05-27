import { create } from 'zustand';
import { profileApi } from '../api/profileApi';
import { aiApi } from '../api/aiApi';
import type { UserProfile, AiRecommendation } from '../types/aiRecommendation';
import { useToastStore } from './useToastStore';
import { useAuthStore } from './useAuthStore';

interface AiRecommendationState {
  profile: UserProfile | null;
  recommendations: AiRecommendation[];
  isProfileLoading: boolean;
  isSavingProfile: boolean;
  isGenerating: boolean;
  error: string | null;
  needsProfileSetup: boolean;

  fetchProfile: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  generateRecommendations: () => Promise<void>;
}

const normalizeErrorMessage = (err: any) => {
  if (err.response?.data?.error) return err.response.data.error;
  if (err.message) return err.message;
  return '알 수 없는 오류가 발생했습니다.';
};

export const useAiRecommendationStore = create<AiRecommendationState>((set, get) => ({
  profile: null,
  recommendations: [],
  isProfileLoading: false,
  isSavingProfile: false,
  isGenerating: false,
  error: null,
  needsProfileSetup: false,

  fetchProfile: async () => {
    if (!useAuthStore.getState().accessToken) return;
    set({ isProfileLoading: true, error: null, needsProfileSetup: false });
    try {
      const data = await profileApi.getProfile();
      set({ profile: data || null, needsProfileSetup: !data });
    } catch (err: any) {
      console.error(err);
      set({ error: normalizeErrorMessage(err) });
    } finally {
      set({ isProfileLoading: false });
    }
  },

  saveProfile: async (profile: UserProfile) => {
    if (!useAuthStore.getState().accessToken) {
      useToastStore.getState().showToast('로그인이 필요합니다.');
      window.location.href = '/auth/login';
      return;
    }
    set({ isSavingProfile: true, error: null });
    try {
      const data = await profileApi.updateProfile(profile);
      set({ profile: data, needsProfileSetup: false });
    } catch (err: any) {
      console.error(err);
      set({ error: normalizeErrorMessage(err) });
      useToastStore.getState().showToast('프로필 저장에 실패했습니다.');
    } finally {
      set({ isSavingProfile: false });
    }
  },

  fetchRecommendations: async () => {
    if (!useAuthStore.getState().accessToken) return;
    set({ isGenerating: true, error: null });
    try {
      const data = await aiApi.getRecommendations();
      set({ recommendations: data || [] });
    } catch (err: any) {
      console.error(err);
      set({ error: normalizeErrorMessage(err) });
    } finally {
      set({ isGenerating: false });
    }
  },

  generateRecommendations: async () => {
    if (!useAuthStore.getState().accessToken) {
      useToastStore.getState().showToast('로그인이 필요합니다.');
      window.location.href = '/auth/login';
      return;
    }
    const state = get();
    if (state.isGenerating) return;

    set({ isGenerating: true, error: null, needsProfileSetup: false });
    try {
      const data = await aiApi.createRecommendations();
      set({ recommendations: data || [] });
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        set({ error: null, needsProfileSetup: true });
      } else if (err.response?.status === 429) {
        set({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' });
        useToastStore.getState().showToast('요청이 많습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        set({ error: normalizeErrorMessage(err) });
        useToastStore.getState().showToast('추천을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      set({ isGenerating: false });
    }
  },
}));
