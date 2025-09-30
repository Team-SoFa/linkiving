'use client';

import clsx from 'clsx';
import React, { useState } from 'react';

import { DropdownMenu } from './DropdownMenu';
import { useDropdown } from './useDropdown';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  defaultSelected?: DropdownOption;
  onSelect?: (option: DropdownOption) => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'blue' | 'white';
}

export default function Dropdown({
  options,
  defaultSelected = options[0],
  onSelect,
  size = 'sm',
  color = 'white',
}: DropdownProps) {
  const { isOpen, toggle, close, dropdownRef } = useDropdown();
  const [selected, setSelected] = useState<DropdownOption | null>(
    defaultSelected ?? options[0] ?? null
  );

  const baseStyle = 'relative inline-block';
  const buttonStyle = 'text-gray-900 max-w-60 rounded-md transition-colors hover:cursor-pointer';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  const colors = {
    red: 'bg-red-200 hover:bg-red-300',
    blue: 'bg-blue-200 hover:bg-blue-300',
    white: 'bg-white hover:bg-gray-300',
  };
  const buttonClasses = clsx(buttonStyle, sizes[size], colors[color]);

  const handleOptionClick = (option: DropdownOption) => {
    setSelected(option); // 선택 상태 업데이트
    onSelect?.(option); // 외부 콜백 호출
    close(); // 메뉴 닫기
  };

  return (
    <div className={baseStyle} ref={dropdownRef}>
      <button
        onClick={toggle}
        className={buttonClasses}
        type="button"
        aria-expanded={isOpen}
        disabled={options.length === 0}
        aria-disabled={options.length === 0}
      >
        {selected?.label ?? '..'}
        {isOpen ? ' ▲' : ' ▼'}
      </button>
      {isOpen && options.length > 0 && (
        <DropdownMenu options={options} onOptionClick={handleOptionClick} size={size} />
      )}
    </div>
  );
}
