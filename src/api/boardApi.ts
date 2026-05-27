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
    await httpClient.delete(`/me/saved-benefits/${id}`);
  },
  updateStatus: async (id: string, status: string): Promise<SavedBenefit> => {
    const { data } = await httpClient.patch(`/me/saved-benefits/${id}/status`, { status });
    return data;
  },
  updateChecklist: async (id: string, checklist: ChecklistItem[]): Promise<SavedBenefit> => {
    const { data } = await httpClient.patch(`/me/saved-benefits/${id}/checklist`, { checklist });
    return data;
  }
};