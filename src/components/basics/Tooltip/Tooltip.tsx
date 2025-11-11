'use client';

import clsx from 'clsx';
import React, { useEffect, useId, useRef, useState } from 'react';

import { style } from './Tooltip.style';

type Timer = ReturnType<typeof setTimeout>;

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content' | 'children'> {
  // 동작 관련 props
  content: React.ReactNode;
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

  const getPositionStyle = (): React.CSSProperties => ({
    top: `${mousePos.y + 8}px`,
    left: `${mousePos.x + 8}px`,
    position: 'fixed',
  });

  // 사용자 이벤트 핸들러와 합성
  const handleMouseEnter: React.MouseEventHandler<HTMLSpanElement> = e => {
    show();
    onMouseEnter?.(e);
  };
  const handleMouseLeave: React.MouseEventHandler<HTMLSpanElement> = e => {
    hide();
    onMouseLeave?.(e);
  };
  const handleMouseMove: React.MouseEventHandler<HTMLSpanElement> = e => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };
  const handleFocus: React.FocusEventHandler<HTMLSpanElement> = e => {
    show();
    onFocus?.(e);
  };
  const handleBlur: React.FocusEventHandler<HTMLSpanElement> = e => {
    hide();
    onBlur?.(e);
  };

  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {children}

      {open && (
        <span
          id={id}
          role="tooltip"
          style={getPositionStyle()}
          className={clsx(style(), className)}
        >
          {content}
        </span>
      )}
    </span>
  );
});

export default Tooltip;
