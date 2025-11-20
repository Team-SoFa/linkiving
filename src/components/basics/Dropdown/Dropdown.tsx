'use client';

import clsx from 'clsx';
import { forwardRef, useState } from 'react';

import Button from '../Button/Button';
import { useDropdown } from './useDropdown';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  options: DropdownOption[];
  defaultSelected?: DropdownOption;
  size?: 'sm' | 'md' | 'lg';
  onSelect?: (option: DropdownOption) => void;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  { options, defaultSelected = options[0], size = 'sm', onSelect, ...rest },
  ref
) {
  const { isOpen, toggle, close } = useDropdown(ref as React.RefObject<HTMLDivElement>);
  const [selected, setSelected] = useState<DropdownOption | null>(
    defaultSelected ?? options[0] ?? null
  );

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const handleOptionClick = (option: DropdownOption) => {
    setSelected(option); // 선택 상태 업데이트
    onSelect?.(option); // 외부 콜백 호출
    close(); // 메뉴 닫기
  };

  return (
    <div ref={ref} className="relative inline-block" {...rest}>
      <Button
        label={selected?.label ?? '..'}
        icon={isOpen ? 'IC_Up' : 'IC_Down'}
        aria-expanded={isOpen}
        disabled={options.length === 0}
        aria-disabled={options.length === 0}
        size={size}
        variant="primary"
        onClick={toggle}
      />
      {isOpen && options.length > 0 && (
        <ul
          className={clsx(
            'absolute z-10 my-1 divide-gray-900 rounded-md bg-white text-gray-900 shadow-md',
            'custom-scrollbar max-h-40 max-w-40 overflow-y-auto',
            'overflow-hidden text-ellipsis whitespace-nowrap'
          )}
          role="menu"
        >
          <div className="">
            {options.map(option => (
              <li
                className={clsx(
                  'truncat w-full cursor-pointer transition-colors hover:bg-gray-200',
                  sizes[size]
                )}
                key={option.value}
                onClick={() => handleOptionClick(option)}
                role="menuItem"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionClick(option);
                  }
                }}
              >
                {option.label}
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
});

export default Dropdown;
