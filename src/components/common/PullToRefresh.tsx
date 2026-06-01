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

  const threshold = 70;
  const maxPullDistance = 96;

  const isAtTop = () =>
    window.scrollY <= 0 && document.documentElement.scrollTop <= 0;

  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    if (!isAtTop()) return;

    startYRef.current = event.touches[0].clientY;
    pullingRef.current = true;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (disabled || isRefreshing || !pullingRef.current) return;
    if (!isAtTop()) return;

    // Prevent pulling if user touches inside common textareas or input fields to preserve native scrolling/selection caret behavior
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

    // Apply smooth logarithmic physical resistance
    const damped = Math.min(diff * 0.45, maxPullDistance);
    setPullDistance(damped);
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || !pullingRef.current) return;

    pullingRef.current = false;

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

  return (
    <div
      className="relative min-h-[100%] w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        className="pointer-events-none fixed left-0 right-0 z-[99999] flex justify-center transition-transform duration-200"
        style={{
          top: 'calc(env(safe-area-inset-top) + 12px)',
          transform: `translateY(${Math.max(pullDistance - 56, -56)}px)`,
          opacity: pullDistance > 8 || isRefreshing ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-500 shadow-lg backdrop-blur border border-divider">
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <RefreshCw
              className="h-4 w-4 transition-transform text-primary"
              style={{ transform: `rotate(${pullDistance * 4}deg)` }}
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

      <div
        className="transition-transform duration-200 w-full min-h-full"
        style={{
          transform: `translateY(${isRefreshing ? 0 : pullDistance * 0.25}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
