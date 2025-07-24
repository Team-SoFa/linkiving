'use client';

import { clsx } from 'clsx';
import React from 'react';
import { tv } from 'tailwind-variants';

import SVGIcon from '../Icons/SVGIcon';
import { IconMapTypes, IconSizeTypes } from '../Icons/icons';

const styles = tv({
  base: 'inline-flex items-center justify-center rounded font-medium whitespace-nowrap transition-all duration-150 outline-none',
  variants: {
    variant: {
      primary: 'cursor-pointer bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
      outline:
        'cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'cursor-pointer bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    },
    size: {
      sm: 'h-8 px-4 py-1.5 text-sm',
      md: 'h-10 px-5 py-2 text-base',
      lg: 'h-12 px-6 py-3 text-lg',
    },
    disabled: {
      true: 'pointer-events-none cursor-not-allowed bg-gray-400 opacity-50',
      false: '',
    },
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onClick' | 'children'> {
  className?: string;
  icon?: IconMapTypes;
  iconPosition?: 'left' | 'right';
  label?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    icon,
    iconPosition = 'left',
    label,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    ...rest
  },
  ref
) {
  // STYLES
  const classes = styles({
    variant,
    size,
    disabled,
  });
  const iconSize: IconSizeTypes = size;

  // RENDERING
  const buttonIcon = icon ? (
    <span
      className={clsx('flex-shrink-0', {
        'mr-2': iconPosition === 'left',
        'ml-2': iconPosition === 'right',
      })}
    >
      <SVGIcon icon={icon} size={iconSize} />
    </span>
  ) : null;
  const buttonLabel = (
    <span
      className={clsx({
        'pr-1': icon && iconPosition === 'left',
        'pl-1': icon && iconPosition === 'right',
      })}
    >
      {label}
    </span>
  );

  let content: React.ReactNode[] = [];

  if (buttonIcon) {
    content = iconPosition === 'left' ? [buttonIcon, buttonLabel] : [buttonLabel, buttonIcon];
  } else {
    content = [buttonLabel];
  }

  return (
    <button
      ref={ref}
      className={clsx(classes, className)}
      disabled={disabled}
      type={type}
      aria-disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
});

export default Button;
