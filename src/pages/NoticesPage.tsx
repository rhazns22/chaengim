import { ChevronLeft, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

const notices = [
  {
    id: 'notice-2026-05-27-benefit-import',
    title: '혜택 데이터 import 구조 안내',
    date: '2026.05.27',
    content: '챙김은 프론트에서 외부 정부 사이트를 직접 호출하지 않고, 백엔드 import/sync 구조를 통해 혜택 데이터를 관리하도록 개선했습니다.',
  },
  {
    id: 'notice-2026-05-27-ai-recommendation',
    title: 'AI 맞춤 추천 안내',
    date: '2026.05.27',
    content: 'AI 추천은 참고용 안내입니다. 최종 자격과 신청 가능 여부는 공식 기관 사이트에서 확인해주세요.',
  },
  {
    id: 'notice-2026-05-27-qa',
    title: '모바일 viewport QA 안내',
    date: '2026.05.27',
    content: 'Chrome headless 기준 375/390/430px 모바일 viewport QA를 진행했습니다. iOS Safari, Android Chrome, PWA standalone 실기기 검증은 추가 확인 대상입니다.',
  },
];

export default function NoticesPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-background pb-[calc(120px+env(safe-area-inset-bottom))]">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-divider bg-white/90 px-4 py-4 backdrop-blur-md">
          <button type="button" onClick={() => navigate(-1)} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-extrabold text-textMain">공지사항</h1>
          <div className="w-10" />
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 rounded-[28px] bg-primary p-6 text-white">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/15">
              <Megaphone size={24} />
            </div>
            <h2 className="text-[22px] font-extrabold leading-snug">챙김 업데이트와 주요 안내</h2>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-white/85">
              서비스 변경 사항과 데이터/추천 기능 안내를 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {notices.map((notice) => (
              <article key={notice.id} className="rounded-[24px] border border-divider bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-[16px] font-extrabold leading-snug text-textMain">{notice.title}</h3>
                  <span className="shrink-0 text-[12px] font-semibold text-textSub">{notice.date}</span>
                </div>
                <p className="text-[13px] font-medium leading-relaxed text-textSub">{notice.content}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
