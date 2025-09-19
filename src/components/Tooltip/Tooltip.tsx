'use client';

import clsx from 'clsx';
import React, { useEffect, useId, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Timer = ReturnType<typeof setTimeout>;

const bubbleStyles = tv({
  base: [
    'pointer-events-none absolute z-50 rounded-lg',
    'border bg-white text-black shadow-lg',
    'px-3 py-2 text-xs font-medium tracking-wide',
    'leading-tight whitespace-nowrap',
  ].join(' '),
});

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content' | 'children'> {
  // 동작 관련 props
  content: React.ReactNode;
  side?: Side;
  offset?: number;
  delay?: number;
  children: React.ReactNode;

  // 스타일링 관련 props
  className?: string;

  // 콜백 관련 props (옵션으로 확장 가능)
  onOpenChange?: (open: boolean) => void;
}

const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    content,
    side = 'bottom',
    offset = 12,
    delay = 80,
    className,
    children,
    onOpenChange,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<Timer | null>(null);

  const setOpenSafe = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpenSafe(true), delay);
  };

  const hide = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpenSafe(false);
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

  // 사용자 이벤트 핸들러와 합성
  const handleMouseEnter: React.MouseEventHandler<HTMLSpanElement> = e => {
    show();
    onMouseEnter?.(e);
  };
  const handleMouseLeave: React.MouseEventHandler<HTMLSpanElement> = e => {
    hide();
    onMouseLeave?.(e);
  };
  const handleFocus: React.FocusEventHandler<HTMLSpanElement> = e => {
    show();
    onFocus?.(e);
  };
  const handleBlur: React.FocusEventHandler<HTMLSpanElement> = e => {
    hide();
    onBlur?.(e);
  };

  const classes = bubbleStyles();

  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus} // focus/blur는 버블링됨
      onBlur={handleBlur}
      // tabIndex 없음: 래퍼는 포커스 불가 → 이중 탭 스톱 방지
      {...rest}
    >
      {children}

      {open && (
        <span
          id={id}
          role="tooltip"
          style={getPositionStyle()}
          className={clsx(classes, className)}
        >
          {content}
        </span>
      )}
    </span>
  );
});

export default Tooltip;
