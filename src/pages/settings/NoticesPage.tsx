import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { httpClient as api } from '../../api/httpClient';

interface Notice {
  id: string;
  title: string;
  category: string;
  isImportant: boolean;
  createdAt: string;
}

export default function NoticesPage() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices').then((res) => {
      setNotices(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-divider bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">공지사항</h1>
        </header>
        <div className="flex-1 overflow-y-auto pb-10">
          {loading ? (
            <div className="p-8 text-center text-[14px] text-textMuted">불러오는 중...</div>
          ) : notices.length === 0 ? (
            <div className="p-8 text-center text-[14px] text-textMuted">등록된 공지사항이 없습니다.</div>
          ) : (
            notices.map((notice) => (
              <button
                key={notice.id}
                type="button"
                onClick={() => navigate(`/settings/notices/${notice.id}`)}
                className="flex w-full items-center justify-between border-b border-divider px-6 py-4 text-left hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {notice.isImportant && (
                      <span className="shrink-0 rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-bold text-danger">중요</span>
                    )}
                    <span className="shrink-0 rounded-full bg-chipBg px-2 py-0.5 text-[11px] font-bold text-primary">
                      {notice.category}
                    </span>
                  </div>
                  <h3 className="truncate text-[15px] font-bold text-textMain">{notice.title}</h3>
                  <p className="mt-1 text-[12px] text-textMuted">
                    {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <ChevronRight size={18} className="ml-2 shrink-0 text-textMuted" />
              </button>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}