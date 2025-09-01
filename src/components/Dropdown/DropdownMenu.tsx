'use client';

import clsx from 'clsx';
import React from 'react';

import type { DropdownOption } from './Dropdown';

interface DropdownMenuProps {
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
  close: () => void;
  size: 'sm' | 'md' | 'lg';
}

export function DropdownMenu({ options, onSelect, close, size }: DropdownMenuProps) {
  const baseStyle = clsx(
    'absolute block in-w-max text-gray-900 bg-white border my-1 rounded-md shadow-md border-none',
    'max-h-40 overflow-y-auto',
    'overflow-hidden whitespace-nowrap text-ellipsis'
  );
  const menuStyle = 'px-4 py-2 transition-colors hover:bg-gray-200 cursor-pointer';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const menuClasses = clsx(menuStyle, sizes[size]);

  return (
    <ul className={baseStyle}>
      {options.map(option => (
        <li
          className={menuClasses}
          key={option.value}
          onClick={() => {
            onSelect(option);
            close();
          }}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
