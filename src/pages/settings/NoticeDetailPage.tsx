import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { httpClient as api } from '../../api/httpClient';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  isImportant: boolean;
  createdAt: string;
}

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/notices/${id}`).then((res) => {
      setNotice(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-divider bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">공지사항</h1>
        </header>
        {loading ? (
          <div className="p-8 text-center text-[14px] text-textMuted">불러오는 중...</div>
        ) : notice ? (
          <div className="flex-1 overflow-y-auto p-6 pb-10">
            <div className="mb-6 border-b border-divider pb-5">
              <div className="mb-2 flex items-center gap-2">
                {notice.isImportant && (
                  <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-bold text-danger">중요</span>
                )}
                <span className="rounded-full bg-chipBg px-2 py-0.5 text-[11px] font-bold text-primary">
                  {notice.category}
                </span>
              </div>
              <h2 className="text-[20px] font-bold text-textMain">{notice.title}</h2>
              <p className="mt-2 text-[13px] text-textMuted">
                {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-textMain">
              {notice.content}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-[14px] text-textMuted">공지사항을 찾을 수 없습니다.</div>
        )}
      </div>
    </PageTransition>
  );
}