'use client';

import clsx from 'clsx';
import React from 'react';

import type { DropdownOption } from './Dropdown';

interface DropdownMenuProps {
  options: DropdownOption[];
  onOptionClick: (option: DropdownOption) => void;
  size: 'sm' | 'md' | 'lg';
}

export function DropdownMenu({ options, onOptionClick, size }: DropdownMenuProps) {
  const baseStyle = clsx(
    'absolute block min-w-max text-gray-900 bg-white my-1 rounded-md shadow-md border-none z-10',
    'max-h-40 overflow-y-auto',
    'overflow-hidden whitespace-nowrap text-ellipsis'
  );
  const menuStyle = 'transition-colors hover:bg-gray-200 cursor-pointer';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const menuClasses = clsx(menuStyle, sizes[size]);

  return (
    <ul className={baseStyle} role="menu">
      {options.map(option => (
        <li
          className={menuClasses}
          key={option.value}
          onClick={() => onOptionClick(option)}
          role="menuitem"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOptionClick(option);
            }
          }}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
