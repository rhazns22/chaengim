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