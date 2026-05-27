const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/BenefitsPage.tsx': `import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';

const CATEGORIES = ['전체', '창업', '금융', '의료', '교육', '생활', '주거'];

export default function BenefitsPage() {
  const { benefits, bookmarkedIds, toggleBookmark } = useBenefitStore();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('전체');

  const filtered = benefits.filter(b => {
    const matchCat = activeCat === '전체' || b.category === activeCat;
    const matchSearch = b.title.includes(search) || b.description.includes(search) || b.agency.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full bg-primary min-h-screen">
      <div className="px-6 pt-14 pb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">혜택 찾기</h1>
        <p className="text-sm text-white/90 mb-6">내 상황에 맞는 생활 지원 혜택을 빠르게 찾아보세요.</p>
        
        <div className="relative mb-6">
          <input 
            type="text"
            placeholder="어떤 혜택을 찾으시나요?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-white rounded-xl pl-12 pr-4 text-sm text-textMain focus:outline-none shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={20} />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={\`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors \${
                activeCat === cat 
                  ? 'bg-white text-primary' 
                  : 'bg-white/20 text-white'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-t-[44px] px-6 pt-8 pb-10 min-h-[500px] flex flex-col gap-3">
        {filtered.map(benefit => (
          <div key={benefit.id} className="relative flex items-center gap-4 p-4 rounded-2xl border border-divider hover:shadow-soft transition-shadow bg-white">
            <Link to={\`/benefits/\${benefit.id}\`} className="flex-1 flex gap-4 min-w-0">
              <div className="w-14 h-14 bg-chipBg rounded-2xl flex flex-shrink-0 items-center justify-center text-2xl">
                {benefit.iconType}
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <h3 className="font-bold text-textMain text-base truncate">{benefit.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-chipBg text-primary text-[10px] font-bold px-2 py-1 rounded-md">
                    {benefit.category}
                  </span>
                  <p className="text-xs text-textSub truncate">{benefit.agency}</p>
                </div>
              </div>
            </Link>
            <button 
              onClick={() => toggleBookmark(benefit.id)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
            >
              <Bookmark 
                size={24} 
                className={\`transition-colors \${bookmarkedIds.includes(benefit.id) ? 'fill-primary text-primary' : 'text-divider'}\`} 
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`,

  'src/pages/BenefitDetailPage.tsx': `import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';

export default function BenefitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { benefits, bookmarkedIds, toggleBookmark } = useBenefitStore();
  const benefit = benefits.find(b => b.id === id);

  if (!benefit) return <div className="p-6 text-center">혜택을 찾을 수 없습니다.</div>;

  return (
    <div className="w-full bg-primary min-h-screen flex flex-col relative pb-24">
      <div className="flex items-center justify-between h-14 px-4 sticky top-0 z-10 text-white">
        <button onClick={() => navigate(-1)} className="p-2"><ChevronLeft size={24} /></button>
        <button onClick={() => toggleBookmark(benefit.id)} className="p-2">
          <Bookmark size={24} className={bookmarkedIds.includes(benefit.id) ? 'fill-white text-white' : 'text-white/50'} />
        </button>
      </div>

      <div className="px-6 pt-6 pb-8 text-white text-center">
        <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto flex items-center justify-center text-4xl mb-4">
          {benefit.iconType}
        </div>
        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
          {benefit.category}
        </span>
        <h1 className="text-2xl font-bold mb-2">{benefit.title}</h1>
        <p className="text-sm text-white/90">{benefit.agency}</p>
      </div>

      <div className="bg-white rounded-t-[44px] px-6 pt-10 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="space-y-6 mb-8">
          <div className="bg-background rounded-2xl p-5">
            <h3 className="text-sm font-bold text-primary mb-2">지원 내용</h3>
            <p className="text-sm text-textMain leading-relaxed">{benefit.supportContent}</p>
          </div>
          <div className="bg-background rounded-2xl p-5">
            <h3 className="text-sm font-bold text-primary mb-2">지원 대상</h3>
            <p className="text-sm text-textMain leading-relaxed">{benefit.target}</p>
          </div>
          <div className="bg-background rounded-2xl p-5">
            <h3 className="text-sm font-bold text-primary mb-2">필요 서류</h3>
            <p className="text-sm text-textMain leading-relaxed">{benefit.documents}</p>
          </div>
          <div className="bg-background rounded-2xl p-5">
            <h3 className="text-sm font-bold text-primary mb-2">신청 방법</h3>
            <p className="text-sm text-textMain leading-relaxed">{benefit.applyMethod}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-white border-t border-divider">
        <button className="w-full bg-primary text-white font-bold h-14 rounded-[26px] shadow-sm flex items-center justify-center">
          공식 신청 페이지로 이동
        </button>
      </div>
    </div>
  );
}`,

  'src/pages/BoardPage.tsx': `import { useBenefitStore } from '../store/useBenefitStore';

export default function BoardPage() {
  const { benefits, bookmarkedIds } = useBenefitStore();
  const savedBenefits = benefits.filter(b => bookmarkedIds.includes(b.id));

  return (
    <div className="w-full bg-primary min-h-screen">
      <div className="px-6 pt-14 pb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">내 신청 보드</h1>
        <p className="text-sm text-white/90">저장한 혜택과 준비 상태를 관리하세요.</p>
      </div>

      <div className="bg-white rounded-t-[44px] px-6 pt-8 min-h-[500px]">
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-textMain text-white rounded-full text-sm font-medium">전체</button>
          <button className="px-4 py-2 bg-background text-textSub rounded-full text-sm font-medium border border-divider">준비중</button>
          <button className="px-4 py-2 bg-background text-textSub rounded-full text-sm font-medium border border-divider">신청완료</button>
        </div>

        <div className="flex flex-col gap-4">
          {savedBenefits.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-divider shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-chipBg rounded-xl flex items-center justify-center text-2xl">
                    {item.iconType}
                  </div>
                  <div>
                    <h3 className="font-bold text-textMain text-base">{item.title}</h3>
                    <p className="text-xs text-textSub">{item.agency}</p>
                  </div>
                </div>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                  {item.status || '준비중'}
                </span>
              </div>
              <div className="h-px bg-divider w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-textSub font-medium">체크리스트 보기</span>
                {item.deadline && <span className="text-sm font-bold text-danger">마감 D-14</span>}
              </div>
            </div>
          ))}
          {savedBenefits.length === 0 && (
            <div className="text-center py-20 text-textSub">저장한 혜택이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}`,

  'src/pages/SchedulePage.tsx': `import { Calendar } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';

export default function SchedulePage() {
  const { benefits, bookmarkedIds } = useBenefitStore();
  const scheduleItems = benefits.filter(b => bookmarkedIds.includes(b.id) && b.deadline);

  return (
    <div className="w-full bg-primary min-h-screen">
      <div className="px-6 pt-14 pb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">신청 일정</h1>
        <p className="text-sm text-white/90">놓치기 쉬운 마감일을 챙겨드릴게요.</p>
      </div>

      <div className="bg-white rounded-t-[44px] px-6 pt-8 min-h-[500px]">
        {scheduleItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            {scheduleItems.map(item => (
              <div key={item.id} className="flex gap-4 items-center p-4 border border-divider rounded-2xl bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-danger/10 text-danger rounded-xl">
                  <span className="text-xs font-bold">D-14</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-textMain text-base">{item.title}</h3>
                  <p className="text-xs text-textSub">{item.deadline} 마감</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center mb-6">
              <Calendar size={40} className="text-divider" />
            </div>
            <h3 className="text-lg font-bold text-textMain mb-2">다가오는 마감 일정이 없어요</h3>
            <p className="text-sm text-textSub mb-6">혜택을 저장하면 신청 마감일을 챙겨드릴게요.</p>
            <button className="bg-primary text-white font-bold py-3 px-6 rounded-full">혜택 둘러보기</button>
          </div>
        )}
      </div>
    </div>
  );
}`,

  'src/pages/MyPage.tsx': `import { Settings, Bell, ChevronRight, LogOut, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/splash');
  };

  return (
    <div className="w-full bg-primary min-h-screen">
      <div className="px-6 pt-14 pb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">마이페이지</h1>
      </div>

      <div className="bg-white rounded-t-[44px] px-6 pt-8 min-h-[500px]">
        <div className="bg-white p-6 rounded-3xl border border-divider flex items-center gap-4 mb-8 shadow-sm">
          <div className="w-16 h-16 bg-chipBg rounded-2xl flex items-center justify-center text-primary font-bold text-2xl">
            {user?.name?.[0] || '게'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-textMain">{user?.name || '게스트'} 님</h2>
            <p className="text-sm text-textSub">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-4 bg-white border border-divider rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <Bell className="text-textSub" size={24} />
              <span className="font-bold text-textMain">알림 설정</span>
            </div>
            <ChevronRight className="text-textMuted" size={20} />
          </div>
          <div className="flex items-center justify-between p-4 bg-white border border-divider rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <Settings className="text-textSub" size={24} />
              <span className="font-bold text-textMain">계정 설정</span>
            </div>
            <ChevronRight className="text-textMuted" size={20} />
          </div>
          <div className="flex items-center justify-between p-4 bg-white border border-divider rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="text-textSub" size={24} />
              <span className="font-bold text-textMain">공지사항</span>
            </div>
            <ChevronRight className="text-textMuted" size={20} />
          </div>
          <button onClick={handleLogout} className="flex items-center justify-between p-4 bg-white border border-divider rounded-2xl shadow-sm mt-4">
            <div className="flex items-center gap-3">
              <LogOut className="text-danger" size={24} />
              <span className="font-bold text-danger">로그아웃</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim());
});
console.log('Generated remaining pages.');
