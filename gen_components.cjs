const fs = require('fs');
const path = require('path');

const files = {
  'src/components/layout/MobileShell.tsx': `import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MobileShell() {
  const location = useLocation();
  const hideNavPaths = ['/splash', '/onboarding', '/login', '/register', '/register/terms', '/register/profile', '/register/verify', '/register/password', '/register/complete'];
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="mx-auto w-full max-w-[430px] bg-background min-h-[100dvh] relative shadow-xl overflow-hidden flex flex-col font-sans">
      <div className={\`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide \${showNav ? 'pb-28' : ''}\`}>
        <Outlet />
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}`,

  'src/components/layout/BottomNav.tsx': `import { Link, useLocation } from 'react-router-dom';
import { Home, Gift, LayoutGrid, Calendar, User } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '혜택', path: '/benefits', icon: Gift },
    { name: '보드', path: '/board', icon: LayoutGrid },
    { name: '일정', path: '/schedule', icon: Calendar },
    { name: '마이페이지', path: '/mypage', icon: User },
  ];

  return (
    <div className="absolute bottom-0 w-full h-[84px] bg-white border-t border-divider flex justify-between items-center px-6 pb-4 pt-2 z-50">
      {navItems.map((item) => {
        const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            className="flex flex-col items-center justify-center w-14 gap-1"
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              className={clsx(
                "transition-colors duration-200",
                isActive ? "text-primary" : "text-navInactive"
              )}
            />
            <span
              className={clsx(
                "text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-navInactive"
              )}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}`,

  'src/components/common/PrimaryButton.tsx': `import React from 'react';
import clsx from 'clsx';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({ children, className, ...props }: Props) {
  return (
    <button 
      className={clsx("w-full bg-primary text-white font-bold h-14 rounded-[26px] shadow-sm flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50", className)}
      {...props}
    >
      {children}
    </button>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim());
});
console.log('Generated components.');
