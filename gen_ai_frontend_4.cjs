const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

write('src/pages/AiRecommendationPage.tsx', `
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, AlertCircle } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import AiRecommendationCard from '../components/ai/AiRecommendationCard';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import PrimaryButton from '../components/common/PrimaryButton';

export default function AiRecommendationPage() {
  const navigate = useNavigate();
  const { 
    recommendations, 
    generateRecommendations, 
    isGenerating, 
    error,
    fetchProfile,
    profile,
    isProfileLoading
  } = useAiRecommendationStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && recommendations.length === 0 && !isGenerating && !error) {
      generateRecommendations();
    }
  }, [profile]);

  if (isProfileLoading) {
    return <div className="flex h-screen items-center justify-center font-bold text-textSub">로딩 중...</div>;
  }

  if (!profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6 bg-gray-50">
        <AlertCircle size={48} className="text-textSub mb-4" />
        <h2 className="text-xl font-bold mb-2 text-textMain">프로필 정보가 없어요</h2>
        <p className="text-center text-textSub font-medium mb-6">AI 맞춤 추천을 위해 프로필을 먼저 설정해주세요.</p>
        <PrimaryButton onClick={() => navigate('/profile-setup')}>프로필 설정하기</PrimaryButton>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="w-full bg-gray-50 min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-gray-100 text-textMain">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-textMain flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            AI 맞춤 추천
          </h1>
          <div className="w-10"></div>
        </div>

        {isGenerating ? (
          <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-chipBg border-t-primary rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-extrabold text-textMain mb-2">조건에 맞는 혜택을 찾고 있어요</h2>
            <p className="text-sm font-medium text-textSub">AI가 {profile.region}에 사는 {profile.employmentStatus}에게<br/>적합한 혜택을 분석 중입니다.</p>
          </div>
        ) : error ? (
          <div className="px-6 py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-textMain mb-2">추천을 불러오지 못했어요</h2>
            <p className="text-sm font-medium text-textSub mb-6">{error}</p>
            <PrimaryButton onClick={() => generateRecommendations()}>다시 시도하기</PrimaryButton>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="px-6 py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-textMain mb-2">조건에 맞는 혜택이 없어요</h2>
            <p className="text-sm font-medium text-textSub mb-6">프로필 조건을 변경해서 다시 시도해보세요.</p>
            <PrimaryButton onClick={() => navigate('/profile-setup')}>프로필 수정하기</PrimaryButton>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-textMain mb-2 leading-tight">
                AI가 분석한<br/>맞춤 혜택입니다
              </h2>
              <p className="text-sm font-medium text-textSub">
                입력하신 조건을 바탕으로 받을 가능성이 높은 혜택을 안내해 드립니다. 실제 자격 요건은 반드시 상세 페이지를 통해 공식 기관에서 확인하세요.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              {recommendations.map(rec => (
                <AiRecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
`);

console.log('Pages generated 4');
