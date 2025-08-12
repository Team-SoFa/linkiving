'use client';

import clsx from 'clsx';
import React from 'react';

import './TextArea.css';

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  placeholder?: string;
  width?: number;
  height?: number;
  maxLength?: number;
}

export default function TextArea({
  value,
  onChange,
  onSubmit,
  placeholder = '무엇이든 물어보세요',
  width = 300,
  height = 100,
  maxLength = 200,
}: TextAreaProps) {
  const baseStyles =
    'border border-gray-300 rounded p-2 resize-none bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-300 custom-scrollbar';
  const counterColorClass = value.length >= maxLength ? 'text-red-400' : 'text-gray-500';
  const counterStyles = clsx(
    'absolute bottom-[-1rem] right-2  text-xs mt-1 select-none',
    counterColorClass
  );

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
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      <div className={counterStyles}>
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
