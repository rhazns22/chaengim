const fs = require('fs');
const path = require('path');

const settingsDir = path.join(__dirname, 'src', 'pages', 'settings');
if (!fs.existsSync(settingsDir)) {
  fs.mkdirSync(settingsDir, { recursive: true });
}

const files = {
  'AccountSettingsPage.tsx': `
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import api from '../../api/axios';

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateName = async () => {
    try {
      await api.patch('/auth/me', { name });
      showToast('이름이 변경되었습니다.');
    } catch (e) {
      showToast('이름 변경에 실패했습니다.');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      showToast('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e) {
      showToast('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">계정 설정</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="mb-4 text-[16px] font-bold text-textMain">기본 정보</h2>
            <div className="mb-4">
              <label className="mb-1 block text-[13px] text-textSub">이메일</label>
              <input disabled value={user?.email || ''} className="w-full rounded-[16px] border border-divider bg-gray-50 px-4 py-3 text-[15px] text-textMuted" />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-[13px] text-textSub">이름</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain" />
            </div>
            <PrimaryButton onClick={handleUpdateName}>이름 변경하기</PrimaryButton>
          </div>

          <div>
            <h2 className="mb-4 text-[16px] font-bold text-textMain">비밀번호 변경</h2>
            <div className="mb-4">
              <label className="mb-1 block text-[13px] text-textSub">현재 비밀번호</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain" />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-[13px] text-textSub">새 비밀번호</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain" />
            </div>
            <PrimaryButton onClick={handleUpdatePassword}>비밀번호 변경하기</PrimaryButton>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
`,
  'SettingsProfilePage.tsx': `
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function SettingsProfilePage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">AI 맞춤 프로필 수정</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="mb-4 text-[15px] text-textSub">
            프로필 설정 페이지로 이동하여<br />
            맞춤 정보를 수정하시겠어요?
          </p>
          <PrimaryButton onClick={() => navigate('/profile-setup')}>프로필 수정하러 가기</PrimaryButton>
        </div>
      </div>
    </PageTransition>
  );
}
`,
  'NotificationSettingsPage.tsx': `
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import api from '../../api/axios';

function Switch({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button
      className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${checked ? 'bg-primary' : 'bg-gray-300'}\`}
      onClick={() => onChange(!checked)}
    >
      <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${checked ? 'translate-x-6' : 'translate-x-1'}\`} />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    deadline7Days: true,
    deadline3Days: true,
    deadline1Day: true,
    aiRecommendation: true,
    notice: true,
  });

  useEffect(() => {
    api.get('/me/notification-settings').then((res) => {
      setSettings(res.data);
    }).catch(console.error);
  }, []);

  const handleChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    api.put('/me/notification-settings', newSettings).catch(console.error);
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">알림 설정</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-textMain">마감 7일 전 알림</span>
              <Switch checked={settings.deadline7Days} onChange={(v) => handleChange('deadline7Days', v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-textMain">마감 3일 전 알림</span>
              <Switch checked={settings.deadline3Days} onChange={(v) => handleChange('deadline3Days', v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-textMain">마감 1일 전 알림</span>
              <Switch checked={settings.deadline1Day} onChange={(v) => handleChange('deadline1Day', v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-textMain">새 추천 혜택 알림</span>
              <Switch checked={settings.aiRecommendation} onChange={(v) => handleChange('aiRecommendation', v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-textMain">공지 알림</span>
              <Switch checked={settings.notice} onChange={(v) => handleChange('notice', v)} />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
`,
  'NoticesPage.tsx': `
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import api from '../../api/axios';

export default function NoticesPage() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    api.get('/notices').then((res) => {
      setNotices(res.data);
    }).catch(console.error);
  }, []);

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4 border-b border-divider">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">공지사항</h1>
        </header>
        <div className="flex-1">
          {notices.map((notice) => (
            <div key={notice.id} onClick={() => navigate(\`/settings/notices/\${notice.id}\`)} className="border-b border-divider p-4 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                {notice.isImportant && <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger text-[12px] font-bold">중요</span>}
                <span className="text-[12px] text-primary font-bold">{notice.category}</span>
              </div>
              <h3 className="text-[15px] font-bold text-textMain">{notice.title}</h3>
              <p className="mt-1 text-[12px] text-textMuted">{new Date(notice.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="p-8 text-center text-textMuted text-[14px]">등록된 공지사항이 없습니다.</div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
`,
  'NoticeDetailPage.tsx': `
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import api from '../../api/axios';

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notice, setNotice] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.get(\`/notices/\${id}\`).then((res) => {
        setNotice(res.data);
      }).catch(console.error);
    }
  }, [id]);

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4 border-b border-divider">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">공지사항</h1>
        </header>
        {notice ? (
          <div className="flex-1 p-6">
            <div className="mb-6 border-b border-divider pb-4">
              <div className="flex items-center gap-2 mb-2">
                {notice.isImportant && <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger text-[12px] font-bold">중요</span>}
                <span className="text-[12px] text-primary font-bold">{notice.category}</span>
              </div>
              <h2 className="text-[20px] font-bold text-textMain">{notice.title}</h2>
              <p className="mt-2 text-[13px] text-textMuted">{new Date(notice.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-[15px] leading-relaxed text-textMain whitespace-pre-wrap">
              {notice.content}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-textMuted">불러오는 중...</div>
        )}
      </div>
    </PageTransition>
  );
}
`,
  'TermsPage.tsx': `
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function TermsPage() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4 border-b border-divider">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">이용약관</h1>
        </header>
        <div className="flex-1 p-6 overflow-y-auto text-[14px] text-textMain leading-relaxed">
          <h2 className="text-[16px] font-bold mb-4">서비스 이용약관</h2>
          <p className="mb-4">챙김은 정부 신청을 대행하는 서비스가 아니라, 혜택 탐색과 신청 준비 관리를 돕는 MVP입니다.</p>
          <p className="mb-4">실제 신청 가능 여부와 최종 자격 확인은 각 공식 기관 사이트에서 진행해야 합니다.</p>
          <p>이용약관 상세 내용이 들어갑니다...</p>
        </div>
      </div>
    </PageTransition>
  );
}
`,
  'PrivacyPage.tsx': `
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4 border-b border-divider">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">개인정보 처리방침</h1>
        </header>
        <div className="flex-1 p-6 overflow-y-auto text-[14px] text-textMain leading-relaxed">
          <h2 className="text-[16px] font-bold mb-4">개인정보 처리방침</h2>
          <p className="mb-4">챙김은 사용자 맞춤 혜택 추천을 위해 최소한의 정보만 수집하며, 민감한 정보(주민등록번호, 계좌, 카드, 정확한 재산 정보 등)는 수집하지 않습니다.</p>
          <p>처리방침 상세 내용이 들어갑니다...</p>
        </div>
      </div>
    </PageTransition>
  );
}
`,
  'AiGuidePage.tsx': `
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';

export default function AiGuidePage() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4 border-b border-divider">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">AI 추천 안내</h1>
        </header>
        <div className="flex-1 p-6 overflow-y-auto text-[14px] text-textMain leading-relaxed">
          <h2 className="text-[16px] font-bold mb-4">AI 추천 시스템 안내</h2>
          <p className="mb-4 text-primary font-bold">AI 추천은 입력 정보를 바탕으로 한 참고용 안내이며, 자격 판정이나 수급 보장을 의미하지 않습니다.</p>
          <p className="mb-4">챙김 서비스에서 제공하는 AI 추천 결과는 정책 데이터와 사용자가 입력한 프로필 정보를 바탕으로 가능성이 높은 혜택을 찾아주는 기능입니다.</p>
          <p>실제 신청 가능 여부와 최종 자격 확인은 각 공식 기관 사이트에서 진행해야 합니다.</p>
        </div>
      </div>
    </PageTransition>
  );
}
`,
  'WithdrawPage.tsx': `
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import api from '../../api/axios';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
  const [confirmText, setConfirmText] = useState('');
  
  const handleWithdraw = async () => {
    if (confirmText !== '탈퇴합니다') {
      showToast('탈퇴 확인 문구를 정확히 입력해주세요.');
      return;
    }
    
    try {
      await api.delete('/auth/me');
      logout();
      showToast('회원 탈퇴가 완료되었습니다.');
      navigate('/login');
    } catch (e) {
      showToast('회원 탈퇴 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">회원 탈퇴</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
              <AlertTriangle className="text-danger" size={32} />
            </div>
            <h2 className="mb-2 text-[20px] font-extrabold text-textMain">정말 탈퇴하시겠어요?</h2>
            <p className="text-[14px] text-textSub leading-relaxed">
              탈퇴 시 계정 정보 및 모든 저장 데이터<br/>(프로필, 혜택, 알림 설정 등)가 <b>즉시 삭제</b>되며,<br/>복구할 수 없습니다.
            </p>
          </div>

          <div className="mb-8 rounded-[16px] bg-gray-50 p-4 text-[13px] text-textMuted">
            <ul className="list-disc pl-5 space-y-1">
              <li>회원 정보 (이메일, 이름, 비밀번호)</li>
              <li>AI 맞춤 프로필 데이터</li>
              <li>저장한 혜택 및 체크리스트</li>
              <li>모든 알림 설정</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-[14px] font-bold text-textMain">
              탈퇴에 동의하시면 아래에 <span className="text-danger">'탈퇴합니다'</span>를 입력해주세요.
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="탈퇴합니다"
              className="w-full rounded-[16px] border border-divider bg-white px-4 py-3 text-[15px] text-textMain outline-none focus:border-danger"
            />
          </div>

          <PrimaryButton 
            className="w-full bg-danger text-white disabled:bg-gray-300 disabled:text-gray-500"
            disabled={confirmText !== '탈퇴합니다'}
            onClick={handleWithdraw}
          >
            모든 정보 삭제하고 탈퇴하기
          </PrimaryButton>
        </div>
      </div>
    </PageTransition>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(settingsDir, filename), content.trim() + '\\n');
}
console.log('Settings pages generated successfully.');
