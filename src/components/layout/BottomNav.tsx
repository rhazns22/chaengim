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
    <div className="fixed bottom-0 inset-x-0 mx-auto z-50 w-full md:max-w-[480px] rounded-t-[32px] border-t border-[#EEF1F7] bg-white shadow-[0_-8px_30px_rgba(91,124,250,0.08)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <nav className="flex justify-around items-center h-[86px] px-2">
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
              <motion.div
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  transition={{ duration: 0.16 }}
                  className="mb-1.5 flex h-[28px] w-[28px] items-center justify-center"
                >
                  <img 
                    src={item.iconSrc} 
                    alt={item.label}
                    className={`h-full w-full object-contain transition-all duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-40 grayscale'
                    }`}
                  />
                </motion.div>
                <span className={`transition-colors duration-150 text-[12px] ${isActive ? 'font-extrabold text-primary' : 'font-bold text-[#9CA3AF]'}`}>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}