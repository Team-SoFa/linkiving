'use client';

import clsx from 'clsx';
import React from 'react';

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'onChange'
> {
  value: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  icon?: React.ReactElement;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    value,
    placeholder = 'Enter text...',
    size = 'md',
    radius = 'md',
    variant = 'outline',
    icon,
    disabled = false,
    className,
    onChange,
    ...rest
  },
  ref
) {
  const baseStyle = 'flex items-center px-3 h-10 text-gray-800 placeholder-gray-400';
  const sizeStyles = {
    sm: 'w-32',
    md: 'w-60',
    lg: 'w-full',
  };
  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-full',
  };
  const variantStyles = {
    outline: 'border border-gray-300 bg-white focus-within:border-gray-600',
    filled: 'bg-blue-200 focus-within:bg-blue-300',
  };

  const classes = clsx(
    className,
    baseStyle,
    sizeStyles[size],
    radiusStyles[radius],
    variantStyles[variant],
    disabled && 'pointer-events-none opacity-50'
  );

  return (
    <div className={classes}>
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent outline-none"
        onChange={onChange}
        {...rest}
      />
      {icon && <span className="ml-2 shrink-0">{icon}</span>}
    </div>
  );
});

export default Input;
