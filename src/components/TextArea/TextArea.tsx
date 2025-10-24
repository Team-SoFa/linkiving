'use client';

import clsx from 'clsx';
import React from 'react';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  width?: 'sm' | 'md' | 'lg'; // 임의로 지정한 키워드로, 추후 변경 가능성 큼
  height?: 'sm' | 'md' | 'lg';
  maxLength?: number;
  radius?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'surface';
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      value,
      onChange,
      placeholder = '무엇이든 물어보세요',
      width = 'md',
      height = 'md',
      maxLength = 200,
      radius = 'md',
      variant = 'default',
      ...rest
    },
    ref
  ) => {
    const isOverMaxLength = value.length >= maxLength;

    const baseStyles =
      'border p-2 resize-none text-gray-900 focus:outline-none focus:ring-1 placeholder:text-gray-300';
    const radiusClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded',
      lg: 'rounded-lg',
    } as const;
    const variantClasses = {
      default: 'bg-white border-gray-300 focus:ring-gray-500',
      surface: 'bg-gray-50 border-gray-200 focus:ring-gray-400',
    } as const;

    const counterColorClass = isOverMaxLength ? 'text-red-400' : 'text-gray-500';

    const widthSizes = {
      sm: 150,
      md: 250,
      lg: 300,
    };
    const heightSizes = {
      sm: 80,
      md: 140,
      lg: 200,
    };
    const counterStyles = clsx(
      'absolute bottom-[-1rem] right-2  text-xs mt-1 select-none',
      counterColorClass
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // IME(한글 등) 조합 중 Enter 잘못 제출되는 것 방지
      const isComposing =
        (e.nativeEvent as KeyboardEvent).isComposing ||
        (e as unknown as { isComposing?: boolean }).isComposing;
      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault(); // 줄바꿈 방지
      }
    };

    return (
      <div className="relative inline-block">
        <textarea
          ref={ref}
          className={clsx(baseStyles, radiusClasses[radius], variantClasses[variant], className)}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          maxLength={maxLength}
          style={{ width: `${widthSizes[width]}px`, height: `${heightSizes[height]}px` }}
          {...rest}
        />
        <div className={counterStyles} aria-live="polite" aria-atomic="true" role="status">
          {value.length}/{maxLength}
        </div>
      </div>
    );
  }
);

export default TextArea;
