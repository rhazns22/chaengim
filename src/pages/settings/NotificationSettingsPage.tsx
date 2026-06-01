import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Bell, Moon, ShieldCheck, AlertCircle } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { httpClient as api } from '../../api/httpClient';
import { useToastStore } from '../../store/useToastStore';

function Switch({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

interface NotificationSettings {
  deadline7Days: boolean;
  deadline3Days: boolean;
  deadline1Day: boolean;
  checklistReminder: boolean;
  aiRecommendation: boolean;
  notice: boolean;
  marketingNotice: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  pushToken: string | null;
  platform: string | null;
}

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const [settings, setSettings] = useState<NotificationSettings>({
    deadline7Days: true,
    deadline3Days: true,
    deadline1Day: true,
    checklistReminder: true,
    aiRecommendation: true,
    notice: true,
    marketingNotice: false,
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
    pushToken: null,
    platform: null,
  });

  const [isQuietHoursEnabled, setIsQuietHoursEnabled] = useState(true);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [showPrePermissionModal, setShowPrePermissionModal] = useState(false);
  const [showDeniedWarning, setShowDeniedWarning] = useState(false);

  // 1. Fetch settings and check browser notification permission state
  useEffect(() => {
    api.get('/me/notification-settings')
      .then((res) => {
        setSettings(res.data);
        setIsQuietHoursEnabled(!!res.data.quietHoursStart && !!res.data.quietHoursEnd);
      })
      .catch((err) => console.error('Failed to load settings', err));

    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  // 2. Local notification helper simulation (scheduling simulation)
  const syncLocalSchedules = (updated: NotificationSettings) => {
    // If running in Capacitor/TWA environment, this simulates local/push notification queue updates
    if (updated.deadline1Day || updated.deadline3Days || updated.deadline7Days) {
      console.log('Simulating capacitor local notification queue updates...');
    }
  };

  const handleToggle = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    api.put('/me/notification-settings', newSettings)
      .then((res) => {
        setSettings(res.data);
        syncLocalSchedules(res.data);
      })
      .catch((err) => {
        console.error(err);
        showToast('설정 저장에 실패했습니다.');
      });
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    setIsQuietHoursEnabled(enabled);
    const newSettings = {
      ...settings,
      quietHoursStart: enabled ? settings.quietHoursStart || '21:00' : null,
      quietHoursEnd: enabled ? settings.quietHoursEnd || '08:00' : null,
    };
    setSettings(newSettings);

    api.put('/me/notification-settings', newSettings)
      .then((res) => setSettings(res.data))
      .catch(console.error);
  };

  const handleQuietHoursChange = (type: 'start' | 'end', val: string) => {
    const newSettings = {
      ...settings,
      quietHoursStart: type === 'start' ? val : settings.quietHoursStart,
      quietHoursEnd: type === 'end' ? val : settings.quietHoursEnd,
    };
    setSettings(newSettings);

    api.put('/me/notification-settings', newSettings)
      .then((res) => setSettings(res.data))
      .catch(console.error);
  };

  // 3. Permission logic complying with Android 13+ guidelines
  const handleRequestPermission = () => {
    if (!('Notification' in window)) {
      showToast('알림을 지원하지 않는 브라우저입니다.');
      return;
    }

    if (Notification.permission === 'granted') {
      showToast('이미 알림 권한이 허용되어 있습니다.');
      return;
    }

    if (Notification.permission === 'denied') {
      setShowDeniedWarning(true);
      return;
    }

    // Show educational custom dialog first!
    setShowPrePermissionModal(true);
  };

  const executeSystemPermissionRequest = async () => {
    setShowPrePermissionModal(false);
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission === 'granted') {
        showToast('알림 권한이 정상 허용되었습니다! 🎉');
        // Register client token placeholder if in capacitor/TWA
        handleToggle('platform', 'WebBrowser');
      } else {
        showToast('알림 권한 요청이 거부되었습니다.');
      }
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col bg-[#F6F7FB]">
        <header 
          className="sticky top-0 z-50 flex items-center border-b border-divider bg-white px-4 shadow-sm"
          style={{
            paddingTop: 'var(--app-top-compact)',
            minHeight: 'var(--app-header-height-compact)',
          }}
        >
          <button onClick={() => navigate(-1)} className="p-2 text-textMain active:opacity-50">
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-2 text-[18px] font-bold text-textMain">알림 설정</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          
          {/* 권한 안내 배너 */}
          <div className="rounded-[24px] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary h-5 w-5" />
                <span className="text-[14px] font-extrabold text-textMain">알림 허용 권한 상태</span>
              </div>
              <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${
                permissionState === 'granted' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-textSub'
              }`}>
                {permissionState === 'granted' ? '허용됨' : permissionState === 'denied' ? '차단됨' : '미정'}
              </span>
            </div>
            
            {permissionState !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="w-full rounded-[16px] bg-primary py-3.5 text-[13px] font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.99] transition-all"
              >
                알림 권한 허용하기
              </button>
            )}

            {showDeniedWarning && (
              <div className="flex items-start gap-2.5 rounded-[16px] bg-danger/5 p-3 border border-danger/10 text-[12px] text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="leading-relaxed font-semibold">
                  기기 설정에서 알림 권한이 차단되어 있습니다. 알림을 수신하려면 스마트폰의 [설정 ➔ 애플리케이션 ➔ 챙김 ➔ 알림]에서 수동 허용으로 직접 변경해 주셔야 합니다.
                </p>
              </div>
            )}
          </div>

          {/* 알림 종류 */}
          <div className="rounded-[24px] bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-divider pb-3">
              <Bell className="text-textSub h-5 w-5" />
              <h3 className="text-[14px] font-extrabold text-textMain">리마인더 수신 항목</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-textMain">마감 7일 전 알림</h4>
                  <p className="text-[11px] text-textSub mt-0.5">저장한 혜택 마감 7일 전 리마인드 알림</p>
                </div>
                <Switch checked={settings.deadline7Days} onChange={(v) => handleToggle('deadline7Days', v)} />
              </div>

              <div className="flex items-center justify-between border-t border-divider/5 pt-4">
                <div>
                  <h4 className="text-[14px] font-bold text-textMain">마감 3일 전 알림</h4>
                  <p className="text-[11px] text-textSub mt-0.5">저장한 혜택 마감 3일 전 리마인드 알림</p>
                </div>
                <Switch checked={settings.deadline3Days} onChange={(v) => handleToggle('deadline3Days', v)} />
              </div>

              <div className="flex items-center justify-between border-t border-divider/5 pt-4">
                <div>
                  <h4 className="text-[14px] font-bold text-textMain">마감 1일 전 알림</h4>
                  <p className="text-[11px] text-textSub mt-0.5">저장한 혜택 마감 1일 전 및 마감 당일 리마인드 알림</p>
                </div>
                <Switch checked={settings.deadline1Day} onChange={(v) => handleToggle('deadline1Day', v)} />
              </div>

              <div className="flex items-center justify-between border-t border-divider/5 pt-4">
                <div>
                  <h4 className="text-[14px] font-bold text-textMain">체크리스트 미완료 알림</h4>
                  <p className="text-[11px] text-textSub mt-0.5">준비 항목이 누락된 혜택 마감 리마인더 발송</p>
                </div>
                <Switch checked={settings.checklistReminder} onChange={(v) => handleToggle('checklistReminder', v)} />
              </div>

              <div className="flex items-center justify-between border-t border-divider/5 pt-4">
                <div>
                  <h4 className="text-[14px] font-bold text-textMain">공지 및 서비스 알림</h4>
                  <p className="text-[11px] text-textSub mt-0.5">새로운 중요 서비스 안내 및 점검 공지 알림</p>
                </div>
                <Switch checked={settings.notice} onChange={(v) => handleToggle('notice', v)} />
              </div>

              <div className="flex items-center justify-between border-t border-divider/5 pt-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[14px] font-bold text-textMain">마케팅 및 혜택 알림</h4>
                    <span className="text-[9px] font-bold bg-gray-100 text-textSub px-1.5 py-0.5 rounded">기본 OFF</span>
                  </div>
                  <p className="text-[11px] text-textSub mt-0.5">이벤트 혜택 정보 및 소식 수신 동의</p>
                </div>
                <Switch checked={settings.marketingNotice} onChange={(v) => handleToggle('marketingNotice', v)} />
              </div>
            </div>
          </div>

          {/* 방해금지 시간 설정 */}
          <div className="rounded-[24px] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="text-textSub h-5 w-5" />
                <span className="text-[14px] font-extrabold text-textMain">야간 방해 금지 시간대 설정</span>
              </div>
              <Switch checked={isQuietHoursEnabled} onChange={handleQuietHoursToggle} />
            </div>

            {isQuietHoursEnabled && (
              <div className="flex items-center gap-4 rounded-[16px] bg-[#F6F7FB] p-3 text-[13px]">
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] text-textSub mb-1">방해 금지 시작</span>
                  <input
                    type="time"
                    value={settings.quietHoursStart || '21:00'}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="bg-transparent text-[14px] font-bold text-textMain border-b border-divider pb-0.5 focus:outline-none"
                  />
                </div>
                <span className="text-textMuted font-bold">~</span>
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] text-textSub mb-1">방해 금지 종료</span>
                  <input
                    type="time"
                    value={settings.quietHoursEnd || '08:00'}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="bg-transparent text-[14px] font-bold text-textMain border-b border-divider pb-0.5 focus:outline-none"
                  />
                </div>
              </div>
            )}
            <p className="text-[11px] text-textSub leading-relaxed">
              설정한 야간 금지 시간대에는 알림이 발생하지 않으며 다음 날 아침 허용 시간 이후에 리스케줄링되어 표시됩니다.
            </p>
          </div>

          {/* 리걸 안내문 (Google Play 출시 심사 필수) */}
          <div className="rounded-[24px] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-textSub" />
              <div className="text-[12px] leading-relaxed text-textMain space-y-2">
                <p className="font-semibold text-primary">ℹ️ 알림 이용 안내사항</p>
                <p>
                  알림은 사용자가 챙김 서비스 내에 <strong>직접 저장한 혜택 항목의 마감일과 신청 준비 체크 상태를 안전하게 파악하도록 돕는 단순 참고용 편의 리마인더</strong>입니다.
                </p>
                <p>
                  본 서비스는 혜택의 최종 자격을 판정하거나 수급 여부를 보장해 드리지 않으며, 신청을 직접 대행하지 않습니다. 변경된 상세 정책과 최신 수혜 자격 확인은 반드시 공식 기관 접수처에서 최종 검증해 주셔야 합니다.
                </p>
                <p>
                  알림 설정의 ON/OFF 동의 상태는 언제든지 이 설정 화면 또는 기기 알림 차단 옵션을 통하여 간편하게 해제하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* POST_NOTIFICATIONS 교육 모달 (Google Play 정책 만족) */}
        {showPrePermissionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
            <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bell size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-[18px] font-extrabold text-textMain leading-snug">챙김 알림 활성화</h3>
                <p className="text-[13px] text-textMain leading-relaxed">
                  챙김은 저장한 정부 혜택의 마감일 및 준비 상태(체크리스트)를 제시간에 알려드리기 위해 기기 알림 권한을 사용합니다.
                </p>
                <p className="text-[12px] text-textSub leading-relaxed">
                  ⚠️ 광고성 혜택 및 이벤트 소식 알림은 별도로 수신에 동의한 경우(마케팅 알림 ON)에만 제한적으로 전송되며 언제든 변경 가능합니다.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPrePermissionModal(false);
                    showToast('알림 권한 활성화를 건너뛰었습니다.');
                  }}
                  className="flex-1 rounded-[16px] bg-gray-100 py-3.5 text-[13px] font-bold text-textSub active:opacity-85"
                >
                  나중에 하기
                </button>
                <button
                  onClick={executeSystemPermissionRequest}
                  className="flex-1 rounded-[16px] bg-primary py-3.5 text-[13px] font-bold text-white shadow-sm active:opacity-85"
                >
                  알림 허용하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}