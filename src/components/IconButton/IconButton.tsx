'use client';

import { clsx } from 'clsx';
import React, { ReactElement } from 'react';

export interface IconButtonProps {
  icon: ReactElement;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  ariaLabel: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, size = 'md', radius = 'md', variant = 'solid', onClick, disabled = false, ariaLabel },
    ref
  ) => {
    const baseStyle = 'inline-flex items-center justify-center focus:bg-gray-300';
    const variants = {
      solid: 'bg-gray-400 text-black hover:bg-gray-200',
      outline: 'border border-gray-200 hover:bg-gray-400',
    };
    const sizes = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
    };
    const radiuses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };
    const classes = clsx(baseStyle, variants[variant], sizes[size], radiuses[radius], {
      'bg-gray-400 opacity-50 cursor-not-allowed hover:bg-gray-400 hover:opacity-50 hover:cursor-not-allowed':
        disabled,
      'cursor-pointer': !disabled,
    });

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
