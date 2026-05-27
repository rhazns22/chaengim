import { useEffect, useState } from 'react';
import { Bell, CalendarClock, ChevronLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { useToastStore } from '../store/useToastStore';

type NotificationSettings = {
  deadline: boolean;
  recommendation: boolean;
  notice: boolean;
};

const storageKey = 'chaengim_notification_settings';
const defaultSettings: NotificationSettings = {
  deadline: true,
  recommendation: true,
  notice: false,
};

const items = [
  {
    key: 'deadline',
    icon: CalendarClock,
    title: '마감 알림',
    description: '저장한 혜택의 마감일이 가까워지면 알려드립니다.',
  },
  {
    key: 'recommendation',
    icon: Sparkles,
    title: '맞춤 추천 알림',
    description: '프로필 조건에 맞는 추천 혜택 업데이트를 알려드립니다.',
  },
  {
    key: 'notice',
    icon: Bell,
    title: '공지 알림',
    description: '서비스 변경과 주요 안내를 받을 수 있습니다.',
  },
] as const;

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
  }, []);

  const toggle = (key: keyof NotificationSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    showToast('알림 설정이 저장되었습니다.');
  };

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-background pb-[calc(120px+env(safe-area-inset-bottom))]">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-divider bg-white/90 px-4 py-4 backdrop-blur-md">
          <button type="button" onClick={() => navigate(-1)} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-extrabold text-textMain">알림 설정</h1>
          <div className="w-10" />
        </div>

        <div className="px-6 py-6">
          <p className="mb-5 text-[14px] font-medium leading-relaxed text-textSub">
            현재 알림 설정은 이 기기에 저장됩니다. 실제 푸시 알림 연동은 배포 환경에서 별도 권한 요청 후 확장할 수 있습니다.
          </p>

          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const Icon = item.icon;
              const enabled = settings[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggle(item.key)}
                  className="flex items-center gap-4 rounded-[24px] border border-divider bg-white p-5 text-left shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-chipBg text-primary">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[16px] font-extrabold text-textMain">{item.title}</h2>
                    <p className="mt-1 text-[13px] font-medium leading-relaxed text-textSub">{item.description}</p>
                  </div>
                  <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
