'use client';

import { useBoolean, useTimeoutFn, useUpdateEffect } from '@reactuses/core';
import clsx from 'clsx';
import React, { useId } from 'react';

import { style } from './Tooltip.style';

type Side = 'top' | 'bottom' | 'left' | 'right';
type TooltipInlineStyle = React.CSSProperties & {
  '--tooltip-offset'?: string;
};

export interface TooltipProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'content' | 'children'
> {
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
  const { value: open, setTrue: openTooltip, setFalse: closeTooltip } = useBoolean(false);
  const [, startDelayTimer, stopDelayTimer] = useTimeoutFn(openTooltip, delay, {
    immediate: false,
  });

  useUpdateEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  const show = () => {
    stopDelayTimer();
    startDelayTimer();
  };

  const hide = () => {
    stopDelayTimer();
    closeTooltip();
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

  const tooltipClassName = style({ side });
  const tooltipStyle: TooltipInlineStyle = {
    '--tooltip-offset': `${offset}px`,
  };

  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {children}

      {open && (
        <span
          id={id}
          role="tooltip"
          style={tooltipStyle}
          className={clsx(tooltipClassName, className)}
        >
          {content}
        </span>
      )}
    </span>
  );
});

export default Tooltip;
