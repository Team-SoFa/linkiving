'use client';

import clsx from 'clsx';
import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  placeholder?: string;
  width?: 'sm' | 'md' | 'lg'; // 임의로 지정한 키워드로, 추후 변경 가능성 큼
  height?: 'sm' | 'md' | 'lg';
  maxLength?: number;
}

export default function TextArea({
  value,
  onChange,
  onSubmit,
  placeholder = '무엇이든 물어보세요',
  width = 'md',
  height = 'md',
  maxLength = 200,
}: TextAreaProps) {
  const isOverMaxLength = value.length >= maxLength;

  const baseStyles =
    'border border-gray-300 rounded p-2 resize-none bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-300';
  const counterColorClass = isOverMaxLength ? 'text-red-400' : 'text-gray-500';
  const counterStyles = clsx(
    'absolute bottom-[-1rem] right-2  text-xs mt-1 select-none',
    counterColorClass
  );
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 방지
      onSubmit?.(); // 입력 완료 콜백 호출
    }
  };

  return (
    <div className="relative inline-block">
      <textarea
        className={baseStyles}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={maxLength}
        style={{ width: `${widthSizes[width]}px`, height: `${heightSizes[height]}px` }}
      />
      <div className={counterStyles}>
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
