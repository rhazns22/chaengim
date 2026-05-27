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