'use client';

import { clsx } from 'clsx';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled,
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center outline-none rounded font-medium transition';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-gray-800 cursor-pointer',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer',
    ghost: 'text-gray-700 hover:bg-gray-100 cursor-pointer',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  // 클래스 조합부
  const classes = clsx(baseStyle, variants[variant], sizes[size], {
    'cursor-not-allowed bg-gray-400 opacity-50': disabled,
    'hover:cursor-not-allowed hover:bg-gray-400 hover:opacity-50': disabled,
  });

  // 버튼 실제 출력 부분
  const ButtonContent = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {ButtonContent}
    </button>
  );
}
