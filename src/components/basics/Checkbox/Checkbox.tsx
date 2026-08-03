'use client';

import clsx from 'clsx';
import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  align?: 'start' | 'center';
  labelClassName?: string;
  checkboxSize?: 'md' | 'lg';
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    id,
    label,
    description,
    error,
    align = 'start',
    labelClassName,
    checkboxSize = 'md',
    className,
    disabled,
    checked,
    defaultChecked,
    ...rest
  },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const checkboxSizeClassName =
    checkboxSize === 'lg' ? 'size-6 rounded-[4px]' : 'size-5 rounded-md';
  const checkIconClassName = checkboxSize === 'lg' ? 'h-3 w-3.5' : 'h-2.5 w-3';

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className={clsx(
          'group flex cursor-pointer gap-3',
          align === 'center' ? 'items-center' : 'items-start',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <span
          className={clsx(
            'relative flex shrink-0 items-center justify-center',
            checkboxSize === 'lg' ? 'mt-0 size-6' : 'mt-0.5 size-5'
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            className="peer sr-only"
            {...rest}
          />
          <span
            className={clsx(
              'border-gray300 peer-focus-visible:ring-blue200 peer-checked:border-blue500 peer-checked:bg-blue500 peer-disabled:border-gray200 peer-disabled:bg-gray100 flex items-center justify-center border bg-white transition-colors peer-focus-visible:ring-2 peer-checked:[&>svg]:block',
              checkboxSizeClassName
            )}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 12 10"
              className={clsx('hidden text-white', checkIconClassName)}
              fill="none"
            >
              <path
                d="M1 5.2 4.2 8.4 11 1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {label && (
            <span className={clsx('font-label-md text-gray900', labelClassName)}>{label}</span>
          )}
          {description && <span className="font-body-sm text-gray500">{description}</span>}
        </span>
      </label>
      {error && (
        <span role="alert" className="text-red500 pl-8 text-xs">
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
