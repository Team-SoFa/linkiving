'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  side?: Side;
  offset?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

type Timer = ReturnType<typeof setTimeout>;

export default function Tooltip({
  content,
  side = 'bottom',
  offset = 12,
  delay = 80,
  className,
  children,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<Timer | null>(null);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getPositionStyle = (): React.CSSProperties => {
    switch (side) {
      case 'top':
        return { bottom: `calc(100% + ${offset}px)`, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: `calc(100% + ${offset}px)`, left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: `calc(100% + ${offset}px)`, top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: `calc(100% + ${offset}px)`, top: '50%', transform: 'translateY(-50%)' };
      default:
        return {};
    }
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show} // ✅ focus/blur는 버블링됨
      onBlur={hide}
      // tabIndex 없음: 래퍼는 포커스 불가 → 이중 탭 스톱 방지
    >
      {children}

      {open && (
        <span
          id={id}
          role="tooltip"
          style={getPositionStyle()}
          className={[
            'pointer-events-none absolute z-50 rounded-lg',
            'bg-white text-black border shadow-lg',
            'px-3 py-2 text-xs font-medium tracking-wide',
            'whitespace-nowrap leading-tight',
            className ?? '',
          ].join(' ')}
        >
          {content}
        </span>
      )}
    </span>
  );
}
