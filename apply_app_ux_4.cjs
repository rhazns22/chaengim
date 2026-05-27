const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. BoardPage.tsx
write('src/pages/BoardPage.tsx', `import { useBenefitStore } from '../store/useBenefitStore';
import BenefitIcon from '../components/common/BenefitIcon';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import { ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BoardPage() {
  const { benefits, bookmarkedIds } = useBenefitStore();
  const savedBenefits = benefits.filter(b => bookmarkedIds.includes(b.id));

  return (
    <PageTransition>
      <div className="w-full bg-primary min-h-full flex flex-col">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-[24px] font-bold mb-2">내 신청 보드</h1>
          <p className="text-[14px] text-white/90">저장한 혜택과 준비 상태를 관리하세요.</p>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          {savedBenefits.length > 0 ? (
            <>
              <div className="flex gap-2 mb-6">
                <motion.button whileTap={{ scale: 0.95 }} className="h-[38px] px-4 bg-textMain text-white rounded-chip text-[14px] font-bold">전체</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} className="h-[38px] px-4 bg-white text-textSub rounded-chip text-[14px] font-medium border border-divider">준비중</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} className="h-[38px] px-4 bg-white text-textSub rounded-chip text-[14px] font-medium border border-divider">신청완료</motion.button>
              </div>

              <div className="flex flex-col gap-4">
                {savedBenefits.map(item => (
                  <motion.div key={item.id} whileTap={{ scale: 0.98 }} className="bg-white p-5 rounded-card border border-divider shadow-sm cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <BenefitIcon iconType={item.iconType} className="w-12 h-12 rounded-xl" />
                        <div>
                          <h3 className="font-bold text-textMain text-[17px] leading-snug">{item.title}</h3>
                          <p className="text-[13px] text-textSub mt-1">{item.agency}</p>
                        </div>
                      </div>
                      <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-1 rounded-md shrink-0">
                        {item.status || '준비중'}
                      </span>
                    </div>
                    <div className="h-px bg-divider w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-textSub font-medium">체크리스트 보기</span>
                      {item.deadline && <span className="text-[14px] font-bold text-danger">마감 D-14</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState 
              icon={<ClipboardList size={32} />}
              title="아직 저장한 혜택이 없어요"
              description="관심 있는 혜택을 저장하면 내 보드에서 한 번에 관리할 수 있어요."
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}`);

// 2. SchedulePage.tsx
write('src/pages/SchedulePage.tsx', `import { Calendar } from 'lucide-react';
import { useBenefitStore } from '../store/useBenefitStore';
import PageTransition from '../components/layout/PageTransition';
import EmptyState from '../components/common/EmptyState';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SchedulePage() {
  const { benefits, bookmarkedIds } = useBenefitStore();
  const scheduleItems = benefits.filter(b => bookmarkedIds.includes(b.id) && b.deadline);
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="w-full bg-primary min-h-full flex flex-col">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-[24px] font-bold mb-2">신청 일정</h1>
          <p className="text-[14px] text-white/90">놓치기 쉬운 마감일을 챙겨드릴게요.</p>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          {scheduleItems.length > 0 ? (
            <div className="flex flex-col gap-4">
              {scheduleItems.map(item => (
                <motion.div key={item.id} whileTap={{ scale: 0.98 }} className="flex gap-4 items-center p-4 border border-divider rounded-card bg-white shadow-sm cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-danger/10 text-danger rounded-2xl shrink-0">
                    <span className="text-[14px] font-bold">D-14</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-textMain text-[17px] truncate">{item.title}</h3>
                    <p className="text-[13px] text-textSub mt-1">{item.deadline} 마감</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<Calendar size={32} />}
              title="다가오는 마감 일정이 없어요"
              description="혜택을 저장하면 신청 마감일을 챙겨드릴게요."
              action={
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/benefits')}
                  className="bg-primary text-white font-bold py-3.5 px-8 rounded-btn text-[15px] shadow-soft"
                >
                  혜택 둘러보기
                </motion.button>
              }
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}`);

// 3. MyPage.tsx
write('src/pages/MyPage.tsx', `import { Settings, Bell, ChevronRight, LogOut, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { motion } from 'framer-motion';

export default function MyPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/splash');
  };

  return (
    <PageTransition>
      <div className="w-full bg-primary min-h-full flex flex-col">
        <div className="px-6 pt-14 pb-8 text-white">
          <h1 className="text-[24px] font-bold mb-2">마이페이지</h1>
        </div>

        <div className="bg-white rounded-t-sheet px-6 pt-8 flex-1">
          <div className="bg-white p-6 rounded-[28px] border border-divider flex items-center gap-4 mb-8 shadow-sm">
            <div className="w-16 h-16 bg-chipBg rounded-2xl flex items-center justify-center text-primary font-bold text-[24px]">
              {user?.name?.[0] || '게'}
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-textMain mb-1">{user?.name || '게스트'} 님</h2>
              <p className="text-[14px] text-textSub">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: Bell, label: '알림 설정' },
              { icon: Settings, label: '계정 설정' },
              { icon: FileText, label: '공지사항' },
            ].map((menu, idx) => (
              <motion.button 
                key={idx} 
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-5 bg-white border border-divider rounded-card shadow-sm w-full"
              >
                <div className="flex items-center gap-3">
                  <menu.icon className="text-textSub" size={24} />
                  <span className="font-bold text-textMain text-[16px]">{menu.label}</span>
                </div>
                <ChevronRight className="text-textMuted" size={20} />
              </motion.button>
            ))}
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout} 
              className="flex items-center justify-between p-5 bg-white border border-divider rounded-card shadow-sm w-full mt-4"
            >
              <div className="flex items-center gap-3">
                <LogOut className="text-danger" size={24} />
                <span className="font-bold text-danger text-[16px]">로그아웃</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}`);

console.log('Script 4 done.');
