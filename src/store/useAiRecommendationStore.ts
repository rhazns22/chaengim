import { create } from 'zustand';
import { profileApi } from '../api/profileApi';
import { aiApi } from '../api/aiApi';
import type { UserProfile, AiRecommendation } from '../types/aiRecommendation';
import { useToastStore } from './useToastStore';

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

export const useAiRecommendationStore = create<AiRecommendationState>((set) => ({
  profile: null,
  recommendations: [],
  isProfileLoading: false,
  isSavingProfile: false,
  isGenerating: false,
  error: null,
  needsProfileSetup: false,

  fetchProfile: async () => {
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
    set({ isGenerating: true, error: null, needsProfileSetup: false });
    try {
      const data = await aiApi.createRecommendations();
      set({ recommendations: data || [] });
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        set({ error: null, needsProfileSetup: true });
      } else {
        set({ error: normalizeErrorMessage(err) });
        useToastStore.getState().showToast('추천을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      set({ isGenerating: false });
    }
  },
}));
