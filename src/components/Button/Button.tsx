'use client';

import { clsx } from 'clsx';
import React from 'react';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: 'inline-flex cursor-pointer items-center rounded font-medium transition outline-none',
  variants: {
    variant: {
      primary: 'bg-gray-900 text-white hover:bg-gray-800',
      secondary: 'bg-gray-50 text-gray-900 hover:bg-blue-50',
      ghost: 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-gray-700',
    },
    size: {
      sm: 'px-4 py-2 text-[12px] [&_svg]:h-4 [&_svg]:w-4',
      md: 'px-5 py-[10px] text-[14px] [&_svg]:h-5 [&_svg]:w-5',
      lg: 'px-6 py-3 text-[16px] [&_svg]:h-6 [&_svg]:w-6',
    },
    radius: {
      sm: 'rounded-[6px]',
      md: 'rounded-[8px]',
      lg: 'rounded-[12px]',
      full: 'rounded-full',
    },
    disabled: {
      true: 'pointer-events-none bg-gray-400 opacity-50',
      false: '',
    },
  },
});

// 많이 해보면서 머리에 넣는 느낌
// HTML 000 Element
// 각 태그들이 가진 액션 (ClickEvent, MouseEvent 등도 ) 같이 알아두자
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled' | 'onClick'> {
  className?: string;
  label?: React.ReactNode;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // HTMLButtonElement 타입에서 발생할 수 있는 MouseEventHandler타입
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      label,
      icon = null,
      iconPosition = 'left',
      type = 'button',
      variant = 'primary',
      size = 'md',
      radius = 'md',
      disabled,
      onClick,
      ...rest
    },
    ref
  ) => {
    const classes = styles({
      variant,
      size,
      radius,
      disabled,
    });

    return (
      <button
        ref={ref}
        className={clsx(classes, className)}
        aria-disabled={disabled}
        disabled={disabled}
        type={type}
        onClick={onClick}
        {...rest}
      >
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {label}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
