const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const absolutePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
};

// 1. index.html meta updates
let indexHtml = fs.readFileSync('index.html', 'utf-8');
if (!indexHtml.includes('apple-mobile-web-app-capable')) {
  const metaTags = `
    <meta name="theme-color" content="#5B7CFA" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
    <link rel="manifest" href="/manifest.json" />
  `;
  indexHtml = indexHtml.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0" />', metaTags);
  write('index.html', indexHtml);
}

// 2. manifest.json
write('public/manifest.json', JSON.stringify({
  name: "챙김",
  short_name: "챙김",
  start_url: "/",
  display: "standalone",
  background_color: "#F7F8FC",
  theme_color: "#5B7CFA",
  icons: [
    {
      src: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ]
}, null, 2));

// 3. globals.css update
let globalsCss = fs.readFileSync('src/styles/globals.css', 'utf-8');
if (!globalsCss.includes('overscroll-behavior-y')) {
  globalsCss = globalsCss.replace('@apply bg-background text-textMain font-sans antialiased m-0 p-0;', 
    '@apply bg-background text-textMain font-sans antialiased m-0 p-0;\n    -webkit-tap-highlight-color: transparent;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    min-height: 100dvh;\n    overscroll-behavior-y: none;');
  globalsCss += `\nhtml, body, #root { height: 100%; } \n* { box-sizing: border-box; }`;
  write('src/styles/globals.css', globalsCss);
}

// 4. tailwind.config.js update
write('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B7CFA",
        primaryDark: "#4968E8",
        textMain: "#33384A",
        textSub: "#8A8F9E",
        textMuted: "#9CA3AF",
        background: "#F7F8FC",
        divider: "#EEF1F7",
        chipBg: "#EEF3FF",
        navInactive: "#9CA3AF",
        danger: "#EF4444",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: [
          'Freesentation',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'float': '0 -4px 20px rgba(0, 0, 0, 0.05)',
        'nav': '0 -8px 30px rgba(91, 124, 250, 0.08)',
      },
      borderRadius: {
        'sheet': '44px',
        'card': '24px',
        'btn': '26px',
        'chip': '999px',
      }
    },
  },
  plugins: [],
}`);

// 5. Stores
write('src/store/useToastStore.ts', `import { create } from 'zustand';

interface ToastState {
  message: string | null;
  isVisible: boolean;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  isVisible: false,
  showToast: (msg) => {
    set({ message: msg, isVisible: true });
    setTimeout(() => {
      set({ isVisible: false });
    }, 2200);
  },
  hideToast: () => set({ isVisible: false }),
}));`);

write('src/store/useBottomSheetStore.ts', `import { create } from 'zustand';
import React from 'react';

interface BottomSheetState {
  isOpen: boolean;
  content: React.ReactNode | null;
  openSheet: (content: React.ReactNode) => void;
  closeSheet: () => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isOpen: false,
  content: null,
  openSheet: (content) => set({ isOpen: true, content }),
  closeSheet: () => set({ isOpen: false }),
}));`);

// 6. Hooks
write('src/hooks/useScrollToTop.ts', `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.getElementById('scroll-container');
    if (root) {
      root.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
}`);

// 7. Common UI Components
write('src/components/common/Toast.tsx', `import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '../../store/useToastStore';

export default function Toast() {
  const { message, isVisible } = useToastStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[380px] bg-textMain text-white text-sm font-medium px-6 py-4 rounded-2xl shadow-float z-[100] text-center"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}`);

write('src/components/common/BottomSheet.tsx', `import { AnimatePresence, motion } from 'framer-motion';
import { useBottomSheetStore } from '../../store/useBottomSheetStore';
import { useEffect } from 'react';

export default function BottomSheet() {
  const { isOpen, content, closeSheet } = useBottomSheetStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSheet}
            className="fixed inset-0 bg-textMain/40 z-[100] max-w-[430px] mx-auto"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-sheet z-[101] pb-safe"
          >
            <div className="w-full flex justify-center py-3">
              <div className="w-12 h-1.5 bg-divider rounded-full" />
            </div>
            <div className="px-6 pb-8 pt-2 max-h-[80vh] overflow-y-auto">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}`);

write('src/components/common/EmptyState.tsx', `import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mb-6 text-textMuted shadow-sm">
        {icon}
      </div>
      <h3 className="text-[18px] font-bold text-textMain mb-2 leading-snug">{title}</h3>
      <p className="text-[14px] text-textSub mb-8 leading-relaxed max-w-[260px]">{description}</p>
      {action}
    </div>
  );
}`);

write('src/components/common/Skeleton.tsx', `export function SkeletonCard() {
  return (
    <div className="w-full bg-white border border-divider rounded-card p-5 animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="w-14 h-14 bg-background rounded-2xl" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-background rounded w-2/3" />
          <div className="h-3 bg-background rounded w-1/2" />
        </div>
      </div>
      <div className="h-px bg-divider w-full mb-4" />
      <div className="h-4 bg-background rounded w-1/3" />
    </div>
  );
}`);

write('src/components/layout/PageTransition.tsx', `import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function PageTransition({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={\`w-full min-h-full \${className}\`}
    >
      {children}
    </motion.div>
  );
}`);

console.log('Script 1 done.');
