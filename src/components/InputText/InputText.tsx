'use client';

import clsx from 'clsx';
import React from 'react';

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  icon?: React.ReactElement;
  className?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    value,
    onChange,
    placeholder = 'Enter text...',
    size = 'md',
    radius = 'md',
    variant = 'outline',
    icon,
    disabled = false,
    className,
    ...rest
  },
  ref
) {
  const baseStyle = 'h-10 text-gray-800 placeholder-gray-400';
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
    disabled && 'opacity-50 cursor-not-allowed',
    'flex items-center px-4'
  );

  return (
    <div className={classes}>
      {icon && <span className="mr-2 shrink-0">{icon}</span>}
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none"
        {...rest}
      />
    </div>
  );
});

export default TextField;
