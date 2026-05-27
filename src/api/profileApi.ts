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