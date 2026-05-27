export type BenefitCategory =
  | "education"
  | "finance"
  | "startup"
  | "medical"
  | "life"
  | "welfare"
  | "employment";

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
  officialSiteName?: string;
  officialAgency?: string;
  source?: string;
  region?: string | null;
  ageGroup?: string | null;
  incomeCondition?: string | null;
  deadline?: string;
  isRecommended?: boolean;
  isDeadlineSoon?: boolean;
  iconType: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BenefitListResponse = {
  items: Benefit[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
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
