'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';

import Button from '../Button/Button';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

// Toast 배경 색상 매핑을 컴포넌트 외부로 분리
export const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-black',
};

export interface ToastProps {
  id: string;
  message: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({
  id,
  message,
  variant = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  // 자동 닫기
  useEffect(() => {
    if (duration > 0) {
      const t = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(t);
    }
  }, [duration, id, onClose]);

  // 공통 스타일
  const baseStyle = 'inline-flex items-center justify-between p-4 rounded shadow-md';
  const classes = clsx(baseStyle, VARIANT_STYLES[variant]);

  return (
    <div className={classes} role="status" aria-live="polite">
      <div className="flex-1">{message}</div>
      {/* Button 컴포넌트를 그대로 사용 */}
      <Button variant="ghost" size="sm" onClick={() => onClose(id)} aria-label="Dismiss toast">
        ×
      </Button>
    </div>
  );
}
