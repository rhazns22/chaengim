import { Loader2, RefreshCw } from 'lucide-react';
import React, { useRef, useState } from 'react';

type PullToRefreshProps = {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  disabled?: boolean;
};

export default function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
}: PullToRefreshProps) {
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const threshold = 56;
  const maxPullDistance = 88;

  const isAtTop = () =>
    window.scrollY <= 0 && document.documentElement.scrollTop <= 0;

  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    if (!isAtTop()) return;

    startYRef.current = event.touches[0].clientY;
    pullingRef.current = true;
    setIsDragging(true);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (disabled || isRefreshing || !pullingRef.current) return;
    if (!isAtTop()) return;

    // Prevent pulling if user touches inside inputs to preserve selection caret
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      return;
    }

    const currentY = event.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff <= 0) {
      setPullDistance(0);
      return;
    }

    // High responsiveness damping multiplier (0.68)
    const damped = Math.min(diff * 0.68, maxPullDistance);
    setPullDistance(damped);
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || !pullingRef.current) {
      setIsDragging(false);
      return;
    }

    pullingRef.current = false;
    setIsDragging(false);

    if (pullDistance >= threshold) {
      try {
        setIsRefreshing(true);
        setPullDistance(56);
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  const ready = pullDistance >= threshold;
  const indicatorY = pullDistance > 0 ? Math.min(pullDistance * 0.72, 56) : -48;

  return (
    <div
      className="relative w-full max-w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        className="pointer-events-none fixed left-0 right-0 z-[60] flex justify-center"
        style={{
          top: 'calc(env(safe-area-inset-top) + 12px)',
          transform: `translateY(${isRefreshing ? 32 : indicatorY}px)`,
          opacity: pullDistance > 3 || isRefreshing ? 1 : 0,
          transition: isDragging ? 'none' : 'transform 220ms ease-out, opacity 220ms ease-out',
        }}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-500 shadow-lg backdrop-blur border border-divider">
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <RefreshCw
              className="h-4 w-4 text-primary"
              style={{ 
                transform: `rotate(${Math.min(pullDistance * 3.2, 220)}deg)`,
                transition: isDragging ? 'none' : 'transform 150ms ease-out'
              }}
            />
          )}
          <span>
            {isRefreshing
              ? '새로고침 중'
              : ready
                ? '놓으면 새로고침'
                : '아래로 당겨 새로고침'}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}
