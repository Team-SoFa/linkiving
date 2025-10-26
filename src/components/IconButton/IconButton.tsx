'use client';

import { clsx } from 'clsx';
import React from 'react';
import { tv } from 'tailwind-variants';

import SVGIcon from '../Icons/SVGIcon';
import { IconMapTypes, IconSizeTypes } from '../Icons/icons';

const styles = tv({
  base: 'inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition-all duration-150 outline-none focus:bg-gray-300',
  variants: {
    variant: {
      ghost: 'bg-gray-50 text-black hover:bg-blue-50 active:bg-blue-100',
      outline: 'border border-gray-200 text-black hover:bg-gray-400 active:bg-gray-500',
    },
    size: {
      sm: 'h-6 w-6 p-1',
      md: 'h-8 w-8 p-2',
      lg: 'h-10 w-10 p-3',
    },
    radius: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    disabled: {
      true: 'pointer-events-none cursor-not-allowed bg-gray-400 opacity-50',
      false: '',
    },
  },
});

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'children'> {
  className?: string;
  icon: IconMapTypes; // icon 타입을 .svg 파일로 강제
  type?: 'button' | 'submit';
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
  ariaLabel: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    className,
    icon,
    type = 'button',
    variant = 'ghost',
    size = 'md',
    radius = 'full',
    disabled = false,
    ariaLabel,
    onClick,
    ...rest
  },
  ref
) {
  // STYLES
  const classes = styles({ variant, size, radius, disabled });
  const iconSize: IconSizeTypes = size;

  return (
    <button
      ref={ref}
      className={clsx(className, classes)}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      {...rest}
    >
      <SVGIcon icon={icon} size={iconSize} className="flex-shrink-0" aria-hidden="true" />
    </button>
  );
});

export default IconButton;
