'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';

import Button from '../Button/Button';
import { style } from './Toast.style';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  // 동작 관련 props
  id: string;
  message: React.ReactNode;
  duration?: number;

  // 스타일링 관련 props
  variant?: ToastVariant;
  className?: string;

  // 콜백 props
  onClose: (id: string) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { id, message, duration = 3000, variant = 'info', className, onClose, ...rest },
  ref
) {
  // 자동 닫기
  useEffect(() => {
    if (duration > 0) {
      const t = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(t);
    }
  }, [duration, id, onClose]);

  const classes = style({ variant, theme: 'light' });

  return (
    <div ref={ref} className={clsx(className, classes)} role="status" aria-live="polite" {...rest}>
      <div className="flex-1">{message}</div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onClose(id)}
        aria-label="Dismiss toast"
        label="×"
      />
    </div>
  );
});

export default Toast;
