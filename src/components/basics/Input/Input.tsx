'use client';

import clsx from 'clsx';
import React from 'react';

import { style } from './Input.styles';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  icon?: React.ReactElement;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    placeholder = 'Enter text...',
    size = 'md',
    radius = 'md',
    variant = 'outline',
    icon,
    disabled = false,
    className,
    value,
    defaultValue,
    ...rest
  },
  ref
) {
  return (
    <div className={clsx(style({ size, radius, variant, disabled }), className)}>
      <input
        ref={ref}
        type="text"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent outline-none"
        {...rest}
      />
      {icon && <span className="ml-2 shrink-0">{icon}</span>}
    </div>
  );
});

export default Input;
