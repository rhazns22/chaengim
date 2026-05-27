const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. MobileShell.tsx
write('src/components/layout/MobileShell.tsx', `import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import BottomNav from './BottomNav';
import Toast from '../common/Toast';
import BottomSheet from '../common/BottomSheet';

export default function MobileShell() {
  const location = useLocation();
  const element = useOutlet();
  
  const hideNavPaths = ['/splash', '/onboarding', '/login', '/register', '/register/terms', '/register/profile', '/register/verify', '/register/password', '/register/complete'];
  const showNav = !hideNavPaths.includes(location.pathname);

  useEffect(() => {
    // Scroll restoration for app-like feeling
    const el = document.getElementById('scroll-container');
    if (el) el.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="mx-auto w-full max-w-[430px] bg-background min-h-[100dvh] relative shadow-xl overflow-hidden flex flex-col font-sans">
      <div id="scroll-container" className={\`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide \${showNav ? 'pb-28' : ''}\`}>
        <AnimatePresence mode="wait" initial={false}>
          {element && React.cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
      </div>
      {showNav && <BottomNav />}
      <Toast />
      <BottomSheet />
    </div>
  );
}`);

// 2. BottomNav.tsx
write('src/components/layout/BottomNav.tsx', `import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ClipboardList, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/benefits', label: '혜택 찾기', icon: Search },
    { path: '/board', label: '내 보드', icon: ClipboardList },
    { path: '/schedule', label: '일정', icon: Calendar },
    { path: '/mypage', label: '마이', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-divider pb-safe z-50 rounded-t-[24px] shadow-nav">
      <div className="flex items-center justify-around h-[84px] px-2">
        {navItems.map(item => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          const Icon = item.icon;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-16 h-14"
            >
              <Icon 
                size={26} 
                className={\`mb-1 transition-colors \${isActive ? 'text-primary' : 'text-navInactive'}\`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={\`text-[11px] font-bold \${isActive ? 'text-primary' : 'text-navInactive'}\`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}`);

// 3. PrimaryButton.tsx (Add motion)
write('src/components/common/PrimaryButton.tsx', `import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function PrimaryButton({ children, onClick, disabled = false, type = 'button', className = '' }: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      className={\`w-full h-14 rounded-btn font-bold text-[16px] transition-colors flex items-center justify-center \${
        disabled ? 'bg-textMuted text-white opacity-50 cursor-not-allowed' : 'bg-primary text-white hover:bg-primaryDark shadow-soft'
      } \${className}\`}
    >
      {children}
    </motion.button>
  );
}`);

console.log('Script 2 done.');
