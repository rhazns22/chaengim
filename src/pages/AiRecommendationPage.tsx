import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import AiRecommendationCard from '../components/ai/AiRecommendationCard';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import PrimaryButton from '../components/common/PrimaryButton';
import { SkeletonCard } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';

export default function AiRecommendationPage() {
  const navigate = useNavigate();
  const {
    recommendations,
    generateRecommendations,
    isGenerating,
    error,
    needsProfileSetup,
    fetchProfile,
    profile,
    isProfileLoading,
  } = useAiRecommendationStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile && recommendations.length === 0 && !isGenerating && !error) {
      generateRecommendations();
    }
  }, [profile, recommendations.length, isGenerating, error, generateRecommendations]);

  if (isProfileLoading) {
    return (
      <PageTransition className="bg-gray-50 p-6 pt-20">
        <SkeletonCard />
        <SkeletonCard />
      </PageTransition>
    );
  }

  if (!profile || needsProfileSetup) {
    return (
      <PageTransition className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
        <EmptyState
          icon={<AlertCircle size={32} />}
          title="프로필 정보가 없습니다"
          description="AI 추천을 받으려면 생년, 지역, 관심 분야 등 기본 프로필을 먼저 입력해주세요."
          action={<PrimaryButton onClick={() => navigate('/profile-setup')}>맞춤 추천 프로필 설정하기</PrimaryButton>}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-gray-50 pb-[calc(120px+env(safe-area-inset-bottom))]">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/85 px-4 py-4 backdrop-blur-md">
          <button onClick={() => navigate(-1)} className="-ml-2 rounded-full p-2 text-textMain active:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex items-center gap-2 text-lg font-bold text-textMain">
            <Sparkles size={18} className="text-primary" />
            AI 맞춤 추천
          </h1>
          <div className="w-10" />
        </div>

        {isGenerating ? (
          <div className="px-6 py-10">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-chipBg border-t-primary" />
              <h2 className="mb-2 text-xl font-extrabold text-textMain">프로필과 혜택 조건을 비교하고 있어요</h2>
              <p className="text-sm font-medium leading-relaxed text-textSub">
                서버 점수 알고리즘으로 후보를 고르고, AI가 이해하기 쉬운 추천 이유를 작성합니다.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-12">
            <EmptyState
              icon={<AlertCircle size={32} />}
              title="추천을 불러오지 못했습니다"
              description={error}
              action={<PrimaryButton onClick={() => generateRecommendations()}>다시 추천받기</PrimaryButton>}
            />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="px-6 py-12">
            <EmptyState
              icon={<AlertCircle size={32} />}
              title="추천 결과가 없습니다"
              description="프로필 조건을 조금 더 자세히 입력한 뒤 다시 시도해보세요."
              action={<PrimaryButton onClick={() => navigate('/profile-setup')}>프로필 수정하기</PrimaryButton>}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-extrabold leading-tight text-textMain">
                지금 확인하면 좋은 혜택입니다
              </h2>
              <p className="text-sm font-medium leading-relaxed text-textSub">
                AI 추천은 참고용 안내입니다.
                최종 자격과 신청 가능 여부는 공식 기관 사이트에서 확인해주세요.
              </p>
            </div>

            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => generateRecommendations()}
                className="rounded-full bg-chipBg px-4 py-2 text-sm font-extrabold text-primary"
              >
                다시 추천받기
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {recommendations.map((recommendation) => (
                <AiRecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
