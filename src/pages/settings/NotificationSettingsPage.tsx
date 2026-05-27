import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { httpClient as api } from '../../api/httpClient';

function Switch({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}
      onClick={() => onChange(!checked)}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

const ITEMS = [
  { key: 'deadline7Days', label: '마감 7일 전 알림' },
  { key: 'deadline3Days', label: '마감 3일 전 알림' },
  { key: 'deadline1Day', label: '마감 1일 전 알림' },
  { key: 'aiRecommendation', label: '새 추천 혜택 알림' },
  { key: 'notice', label: '공지 알림' },
] as const;

type SettingsKey = typeof ITEMS[number]['key'];

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<SettingsKey, boolean>>({
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

  const handleChange = (key: SettingsKey, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    api.put('/me/notification-settings', newSettings).catch(console.error);
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-divider bg-white px-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">알림 설정</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 pb-10">
          <div className="flex flex-col divide-y divide-divider">
            {ITEMS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-5">
                <span className="text-[16px] font-semibold text-textMain">{label}</span>
                <Switch checked={settings[key]} onChange={(v) => handleChange(key, v)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}