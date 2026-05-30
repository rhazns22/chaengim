import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import iconHome from '../../assets/icons/nav-home.png';
import iconBenefit from '../../assets/icons/nav-benefit.png';
import iconBoard from '../../assets/icons/nav-board.png';
import iconSchedule from '../../assets/icons/nav-schedule.png';
import iconMyPage from '../../assets/icons/nav-mypage.png';

const navItems = [
  { iconSrc: iconHome, label: '홈', path: '/' },
  { iconSrc: iconBenefit, label: '혜택', path: '/benefits' },
  { iconSrc: iconBoard, label: '보드', path: '/board' },
  { iconSrc: iconSchedule, label: '일정', path: '/schedule' },
  { iconSrc: iconMyPage, label: '마이페이지', path: '/mypage' },
];

export default function BottomNav() {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/splash') {
    return null;
  }

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 mx-auto z-50 w-full md:max-w-[480px] bg-white border-t border-[#EEF1F7] shadow-[0_-8px_30px_rgba(91,124,250,0.08)] rounded-t-[28px]" 
      style={{ 
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }}
    >
      <div className="flex justify-around items-center h-[68px] px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-primary' : 'text-textMuted'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center h-[56px] min-w-0 px-1"
              >
                <motion.div
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  transition={{ duration: 0.16 }}
                  className="mb-1 flex h-[24px] w-[24px] items-center justify-center shrink-0"
                >
                  <img 
                    src={item.iconSrc} 
                    alt={item.label}
                    className={`h-full w-full object-contain transition-all duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-40 grayscale'
                    }`}
                  />
                </motion.div>
                <span className={`transition-colors duration-150 text-[10px] sm:text-[11px] leading-none whitespace-nowrap ${isActive ? 'font-extrabold text-primary' : 'font-bold text-[#9CA3AF]'}`}>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}