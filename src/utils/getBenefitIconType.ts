export type BenefitIconType =
  | 'education'
  | 'finance'
  | 'startup'
  | 'life'
  | 'welfare'
  | 'medical'
  | 'employment';

export function getBenefitIconType(category?: string, title?: string): BenefitIconType {
  const text = `${category ?? ''} ${title ?? ''}`;

  if (/교육|장학|학자금|훈련|강의|학교|대학생/.test(text)) return 'education';
  if (/금융|자산|지원금|수당|급여|대출|저축|세금|환급/.test(text)) return 'finance';
  if (/창업|기업|사업|소상공인|자영업/.test(text)) return 'startup';
  if (/주거|생활|월세|전세|임대|주택|에너지|전기|가스|교통/.test(text)) return 'life';
  if (/의료|보건|건강|병원|돌봄|치료/.test(text)) return 'medical';
  if (/청년|고용|취업|일자리|구직|근로/.test(text)) return 'employment';

  return 'welfare';
}
