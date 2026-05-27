import { httpClient } from './httpClient';
import type { Benefit, BenefitListResponse } from '../types/benefit';

export type BenefitListParams = {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  region?: string;
  recommended?: boolean;
  deadlineSoon?: boolean;
};

export const benefitApi = {
  getBenefits: async (params?: BenefitListParams): Promise<BenefitListResponse> => {
    const { data } = await httpClient.get('/benefits', { params });
    return data;
  },
  getBenefitById: async (id: string): Promise<Benefit> => {
    const { data } = await httpClient.get(`/benefits/${id}`);
    return data;
  }
};
