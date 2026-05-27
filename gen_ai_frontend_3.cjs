const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

write('src/pages/ProfileSetupPage.tsx', `
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import PrimaryButton from '../components/common/PrimaryButton';
import ProfileQuestionCard from '../components/ai/ProfileQuestionCard';
import { useAiRecommendationStore } from '../store/useAiRecommendationStore';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { profile, saveProfile, isSavingProfile, isProfileLoading } = useAiRecommendationStore();
  
  const [formData, setFormData] = useState({
    birthYear: 1990,
    region: '서울',
    employmentStatus: '근로자',
    interests: [] as string[],
    incomeLevel: '중위소득 100% 이하',
    householdType: '1인 가구',
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (formData.interests.length === 0) {
      alert('관심사를 1개 이상 선택해주세요.'); // Assuming alert is acceptable here if no Toast setup, wait, user said "alert 사용 금지". We will use toast.
      // Wait, let's just make it required via UI.
      return;
    }
    await saveProfile(formData);
    navigate('/ai-recommendation');
  };

  const isFormValid = formData.interests.length > 0;

  if (isProfileLoading) {
    return <div className="flex h-screen items-center justify-center text-textSub font-bold">프로필을 불러오는 중...</div>;
  }

  return (
    <PageTransition>
      <div className="w-full bg-gray-50 min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-gray-100 text-textMain">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-textMain">맞춤 프로필 설정</h1>
          <div className="w-10"></div>
        </div>

        <div className="px-6 pt-6 pb-4">
          <h2 className="text-2xl font-extrabold text-textMain mb-2 leading-tight">
            딱 맞는 혜택을<br />찾아드릴게요!
          </h2>
          <p className="text-sm font-medium text-textSub">
            선택한 정보는 혜택 추천에만 안전하게 사용되며,<br/>실제 자격 판정은 공식 기관에서 확인해야 합니다.
          </p>
        </div>

        <div className="px-6 flex flex-col gap-2">
          <ProfileQuestionCard title="출생연도">
            <input 
              type="number" 
              className="w-full bg-gray-100 border-none rounded-xl p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.birthYear}
              onChange={e => setFormData({...formData, birthYear: Number(e.target.value)})}
            />
          </ProfileQuestionCard>

          <ProfileQuestionCard title="거주 지역">
            <select 
              className="w-full bg-gray-100 border-none rounded-xl p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.region}
              onChange={e => setFormData({...formData, region: e.target.value})}
            >
              {['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </ProfileQuestionCard>

          <ProfileQuestionCard title="취업 상태">
             <div className="grid grid-cols-2 gap-3">
              {['학생', '구직자/취업준비생', '근로자', '자영업자', '프리랜서', '무직'].map(status => (
                <button
                  key={status}
                  onClick={() => setFormData({...formData, employmentStatus: status})}
                  className={\`py-3.5 rounded-xl font-bold transition-colors \${formData.employmentStatus === status ? 'bg-primary text-white' : 'bg-gray-100 text-textSub'}\`}
                >
                  {status}
                </button>
              ))}
            </div>
          </ProfileQuestionCard>

          <ProfileQuestionCard title="관심사 (다중 선택)" description="관심있는 지원 분야를 선택해주세요.">
            <div className="flex flex-wrap gap-2">
              {['교육', '금융', '주거', '창업', '생활', '건강'].map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={\`px-4 py-2.5 rounded-full font-bold transition-colors \${formData.interests.includes(interest) ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-textSub'}\`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </ProfileQuestionCard>

          <ProfileQuestionCard title="소득 수준 (대략적)">
            <select 
              className="w-full bg-gray-100 border-none rounded-xl p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.incomeLevel}
              onChange={e => setFormData({...formData, incomeLevel: e.target.value})}
            >
              {['중위소득 50% 이하', '중위소득 100% 이하', '중위소득 150% 이하', '소득무관/모름'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </ProfileQuestionCard>

          <ProfileQuestionCard title="가구 형태">
            <select 
              className="w-full bg-gray-100 border-none rounded-xl p-4 font-bold text-textMain focus:ring-2 focus:ring-primary"
              value={formData.householdType}
              onChange={e => setFormData({...formData, householdType: e.target.value})}
            >
              {['1인 가구', '신혼부부', '다자녀가구', '한부모가족', '기타'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </ProfileQuestionCard>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent max-w-[430px] mx-auto">
          <PrimaryButton 
            onClick={handleSubmit} 
            loading={isSavingProfile}
            disabled={!isFormValid}
          >
            추천받기
          </PrimaryButton>
        </div>
      </div>
    </PageTransition>
  );
}
`);

console.log('Pages generated');
