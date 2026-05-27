const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

write('src/types/aiRecommendation.ts', `
import type { Benefit } from './benefit';

export interface UserProfile {
  id?: string;
  birthYear: number;
  region: string;
  employmentStatus: string;
  interests: string[];
  incomeLevel: string;
  householdType: string;
}

export interface AiRecommendation {
  id: string;
  benefitId: string;
  score: number;
  reason: string;
  matchedTags: string[];
  caution: string;
  benefit?: Benefit;
}
`);

write('src/api/profileApi.ts', `
import { httpClient } from './httpClient';
import type { UserProfile } from '../types/aiRecommendation';

export const profileApi = {
  getProfile: async () => {
    const { data } = await httpClient.get<UserProfile>('/me/profile');
    return data;
  },
  updateProfile: async (profile: UserProfile) => {
    const { data } = await httpClient.put<UserProfile>('/me/profile', profile);
    return data;
  }
};
`);

write('src/api/aiApi.ts', `
import { httpClient } from './httpClient';
import type { AiRecommendation } from '../types/aiRecommendation';

export const aiApi = {
  getRecommendations: async () => {
    const { data } = await httpClient.get<AiRecommendation[]>('/ai/recommendations');
    return data;
  },
  createRecommendations: async () => {
    const { data } = await httpClient.post<AiRecommendation[]>('/ai/recommendations');
    return data;
  }
};
`);

write('src/store/useAiRecommendationStore.ts', `
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

  fetchProfile: async () => {
    set({ isProfileLoading: true, error: null });
    try {
      const data = await profileApi.getProfile();
      set({ profile: data || null });
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
      set({ profile: data });
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
    set({ isGenerating: true, error: null });
    try {
      const data = await aiApi.createRecommendations();
      set({ recommendations: data || [] });
    } catch (err: any) {
      console.error(err);
      set({ error: normalizeErrorMessage(err) });
      useToastStore.getState().showToast('AI 추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      set({ isGenerating: false });
    }
  },
}));
`);

console.log('API and Store generated');
