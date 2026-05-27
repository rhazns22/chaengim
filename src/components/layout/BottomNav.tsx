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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] rounded-t-[32px] border-t border-[#EEF1F7] bg-white shadow-[0_-8px_30px_rgba(91,124,250,0.08)] pb-safe">
      <nav className="flex justify-around items-center h-[86px] px-2 pb-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-textMuted'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div whileTap={{ scale: 0.96 }} className="flex flex-col items-center">
                <div className="w-[28px] h-[28px] mb-1.5 flex items-center justify-center">
                  <img 
                    src={item.iconSrc} 
                    alt={item.label}
                    className={`w-full h-full object-contain transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-40 grayscale'
                    }`}
                  />
                </div>
                <span className={`text-[12px] ${isActive ? 'font-extrabold text-primary' : 'font-bold text-[#9CA3AF]'}`}>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}