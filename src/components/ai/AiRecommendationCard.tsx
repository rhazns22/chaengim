import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { AiRecommendation } from '../../types/aiRecommendation';

interface Props {
  recommendation: AiRecommendation;
}

export default function AiRecommendationCard({ recommendation }: Props) {
  const benefit = recommendation.benefit;
  if (!benefit) return null;

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="mb-1 block text-xs font-semibold text-textSub">{benefit.agency}</span>
          <h3 className="text-lg font-extrabold text-textMain">{benefit.title}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-full bg-chipBg px-3 py-1.5 text-sm font-bold text-primary">
          <span className="mb-0.5 text-[10px] leading-none opacity-80">조건 매칭도</span>
          <span>{recommendation.score}점</span>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-4 text-sm font-medium leading-relaxed text-textMain">
        <span className="mr-2 font-bold text-primary">추천 이유</span>
        {recommendation.reason}
      </div>

      {recommendation.matchedTags && recommendation.matchedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recommendation.matchedTags.map((tag) => (
            <span key={tag} className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-[12px] font-medium leading-relaxed text-textSub">
        {recommendation.caution}
      </div>

      <Link
        to={`/benefits/${benefit.id}`}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-bold text-white transition-transform active:scale-[0.98]"
      >
        상세 보기
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
