import { useEffect, useState } from 'react';
import { useMotionValue, animate, useReducedMotion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number | string | null | undefined;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
  duration = 0.7,
  className = '',
}: AnimatedNumberProps) {
  const parsedValue = typeof value === 'number' && !Number.isNaN(value) ? value : parseInt(String(value), 10) || 0;
  
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? parsedValue : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(parsedValue);
      return;
    }

    if (parsedValue === 0) {
      motionValue.set(0);
      setDisplayValue(0);
      return;
    }

    const controls = animate(motionValue, parsedValue, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [parsedValue, duration, shouldReduceMotion, motionValue]);

  const formattedNumber = new Intl.NumberFormat('ko-KR').format(displayValue);

  return (
    <span className={className}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}
