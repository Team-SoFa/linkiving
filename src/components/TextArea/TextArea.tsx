'use client';

import clsx from 'clsx';
import React from 'react';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: 'resize-none border p-2 text-gray-900 placeholder:text-gray-300 focus:ring-1 focus:outline-none',
  variants: {
    variant: {
      default: 'border-gray-300 bg-white focus:ring-gray-500',
      surface: 'border-gray-200 bg-gray-50 focus:ring-gray-400',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded',
      lg: 'rounded-lg',
    },
  },
});
export interface TextAreaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange' | 'onSubmit'
  > {
  className?: string;
  maxLength?: number;
  placeholder?: string;
  value: string;
  variant?: 'default' | 'surface';
  width?: 'sm' | 'md' | 'lg'; // 임의로 지정한 키워드로, 추후 변경 가능성 큼
  height?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (e?: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    className,
    maxLength = 200,
    placeholder = '무엇이든 물어보세요',
    value,
    variant = 'default',
    width = 'md',
    height = 'md',
    radius = 'md',
    onChange,
    onSubmit,
    ...rest
  },
  ref
) {
  const isOverMaxLength = value.length >= maxLength;

  const widthSizes = { sm: 150, md: 250, lg: 300 };
  const heightSizes = { sm: 80, md: 140, lg: 200 };

  const classes = styles({
    variant,
    radius,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // IME(한글 등) 조합 중 Enter 잘못 제출되는 것 방지
    const isComposing =
      (e.nativeEvent as KeyboardEvent).isComposing ||
      (e as unknown as { isComposing?: boolean }).isComposing;
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault(); // 줄바꿈 방지
      onSubmit?.();
    }
  };

  return (
    <div className="relative inline-block pb-4">
      <textarea
        ref={ref}
        className={clsx(classes, className)}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={maxLength}
        style={{ width: `${widthSizes[width]}px`, height: `${heightSizes[height]}px` }}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      <div
        className={clsx(
          'absolute right-2 -bottom-1 text-xs select-none',
          isOverMaxLength ? 'text-red-400' : 'text-gray-500'
        )}
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {value.length}/{maxLength}
      </div>
    </div>
  );
});

export default TextArea;
