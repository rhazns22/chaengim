const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

write('src/components/ai/AiRecommendationCard.tsx', `
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
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs text-textSub font-semibold mb-1 block">{benefit.agency}</span>
          <h3 className="text-lg font-extrabold text-textMain">{benefit.title}</h3>
        </div>
        <div className="bg-chipBg text-primary px-3 py-1.5 rounded-full text-sm font-bold flex flex-col items-center">
          <span className="text-[10px] leading-none opacity-80 mb-0.5">추천도</span>
          <span>{recommendation.score}%</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl text-sm font-medium text-textMain whitespace-pre-line leading-relaxed">
        <span className="font-bold text-primary mr-2">AI 분석:</span>
        {recommendation.reason}
      </div>

      {recommendation.matchedTags && recommendation.matchedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recommendation.matchedTags.map((tag, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-[11px] text-textSub font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
        <span className="block mb-1 font-bold">⚠️ 참고사항</span>
        {recommendation.caution}
      </div>

      <Link 
        to={\`/benefits/\${benefit.id}\`}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-full font-bold active:scale-[0.98] transition-transform"
      >
        상세 정보 확인하기
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
`);

write('src/components/ai/ProfileQuestionCard.tsx', `
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function ProfileQuestionCard({ title, description, children }: Props) {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm mb-4">
      <h3 className="text-lg font-extrabold text-textMain mb-2">{title}</h3>
      {description && <p className="text-sm text-textSub font-medium mb-5">{description}</p>}
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
`);

console.log('UI Components generated');
