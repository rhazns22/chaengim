import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import PrimaryButton from '../components/common/PrimaryButton';
import ProfileQuestionCard from '../components/ai/ProfileQuestionCard';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';
import { useToastStore } from '../store/useToastStore';

const regions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const employmentStatuses = ['학생', '구직/취업준비', '근로자', '자영업자', '프리랜서', '무직'];
const interests = ['교육', '금융', '주거', '창업', '생활', '의료', '복지', '취업'];
const incomeLevels = ['중위소득 50% 이하', '중위소득 100% 이하', '중위소득 150% 이하', '소득 무관/모름'];
const householdTypes = ['1인 가구', '신혼부부', '다자녀 가구', '한부모 가구', '기타'];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { profile, saveProfile, isSavingProfile, isProfileLoading, fetchProfile } = useAiRecommendationStore();

  const [formData, setFormData] = useState({
    birthYear: 1990,
    region: '서울',
    employmentStatus: '근로자',
    interests: [] as string[],
    incomeLevel: '중위소득 100% 이하',
    householdType: '1인 가구',
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        birthYear: profile.birthYear,
        region: profile.region,
        employmentStatus: profile.employmentStatus,
        interests: profile.interests,
        incomeLevel: profile.incomeLevel,
        householdType: profile.householdType,
      });
    }
  }, [profile]);

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async () => {
    if (formData.interests.length === 0) {
      showToast('관심 분야를 1개 이상 선택해주세요.');
      return;
    }

    const payload: any = {};
    if (formData.birthYear) payload.birthYear = Number(formData.birthYear);
    if (formData.region) payload.region = formData.region;
    if (formData.employmentStatus) payload.employmentStatus = formData.employmentStatus;
    if (Array.isArray(formData.interests) && formData.interests.length > 0) payload.interests = formData.interests;
    if (formData.incomeLevel) payload.incomeLevel = formData.incomeLevel;
    if (formData.householdType) payload.householdType = formData.householdType;

    await saveProfile(payload);
    navigate('/', { replace: true });
  };

  const isFormValid = formData.interests.length > 0;

  if (isProfileLoading) {
    return (
      <PageTransition className="flex h-screen items-center justify-center font-bold text-textSub">
        프로필을 불러오는 중...
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div 
        className="min-h-screen w-full bg-gray-50 overflow-x-hidden relative"
        style={{ paddingBottom: 'calc(112px + max(env(safe-area-inset-bottom), 12px))' }}
      >
        <div 
          className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white/85 px-6 backdrop-blur-md"
          style={{
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
            height: 'calc(env(safe-area-inset-top) + 64px)',
          }}
        >
          <button onClick={() => navigate(-1)} className="-ml-2 rounded-full p-2 text-textMain active:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[17px] font-bold text-textMain">맞춤 프로필 설정</h1>
          <div className="w-10" />
        </div>

        <div className="px-6 pb-6 pt-12">
          <h2 className="mb-3 text-[28px] font-extrabold leading-[1.3] text-textMain tracking-tight">
            나에게 맞는 혜택을<br />찾아드릴게요
          </h2>
          <p className="text-sm font-semibold leading-relaxed text-textSub">
            입력한 정보는 혜택 조건 매칭에만 사용돼요.<br />
            챙김은 이 정보를 바탕으로 받을 가능성이 높은 혜택을 먼저 보여줍니다.
          </p>
        </div>

        <div className="flex flex-col gap-2 px-6">
          <ProfileQuestionCard title="출생연도">
            <input
              type="number"
              inputMode="numeric"
              className="w-full rounded-xl border-none bg-gray-100 p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.birthYear}
              onChange={(event) => setFormData({ ...formData, birthYear: Number(event.target.value) })}
            />
          </ProfileQuestionCard>

          <ProfileQuestionCard title="거주 지역">
            <select
              className="w-full rounded-xl border-none bg-gray-100 p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.region}
              onChange={(event) => setFormData({ ...formData, region: event.target.value })}
            >
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </ProfileQuestionCard>

          <ProfileQuestionCard title="현재 상태">
            <div className="grid grid-cols-2 gap-3">
              {employmentStatuses.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setFormData({ ...formData, employmentStatus: status })}
                  className={`rounded-xl py-3.5 font-bold transition-colors ${formData.employmentStatus === status ? 'bg-primary text-white' : 'bg-gray-100 text-textSub'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </ProfileQuestionCard>

          <ProfileQuestionCard title="관심 분야" description="추천받고 싶은 혜택 분야를 선택해주세요.">
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-4 py-2.5 font-bold transition-colors ${formData.interests.includes(interest) ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-textSub'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </ProfileQuestionCard>

          <ProfileQuestionCard 
            title="소득 구간" 
            description="정확한 소득 심사는 공식 기관에서 진행됩니다. 추천 필터링을 위한 참고 정보로만 사용돼요."
          >
            <select
              className="w-full rounded-xl border-none bg-gray-100 p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.incomeLevel}
              onChange={(event) => setFormData({ ...formData, incomeLevel: event.target.value })}
            >
              {incomeLevels.map((incomeLevel) => (
                <option key={incomeLevel} value={incomeLevel}>{incomeLevel}</option>
              ))}
            </select>
          </ProfileQuestionCard>

          <ProfileQuestionCard title="가구 형태">
            <select
              className="w-full rounded-xl border-none bg-gray-100 p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.householdType}
              onChange={(event) => setFormData({ ...formData, householdType: event.target.value })}
            >
              {householdTypes.map((householdType) => (
                <option key={householdType} value={householdType}>{householdType}</option>
              ))}
            </select>
          </ProfileQuestionCard>
        </div>

        <div 
          className="fixed bottom-0 inset-x-0 mx-auto w-full md:max-w-[480px] z-50 bg-gradient-to-t from-white via-white to-transparent px-6 pt-6"
          style={{ paddingBottom: 'calc(16px + max(env(safe-area-inset-bottom), 12px))' }}
        >
          <PrimaryButton onClick={handleSubmit} loading={isSavingProfile} disabled={!isFormValid}>
            맞춤 추천 확인하기
          </PrimaryButton>
        </div>
      </div>
    </PageTransition>
  );
}
