'use client';

import { clsx } from 'clsx';
import React, { ReactElement } from 'react';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: 'inline-flex items-center justify-center focus:bg-gray-300',
  variants: {
    variant: {
      ghost: 'bg-gray-50 text-black hover:bg-blue-50',
      outline: 'border border-gray-200 hover:bg-gray-400',
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
      true: 'pointer-events-none bg-gray-400 opacity-50',
      false: '',
    },
  },
});
const iconStyles = tv({
  variants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
    },
  },
});

export interface IconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  className?: string;
  icon: ReactElement<React.SVGProps<SVGSVGElement>>; // icon 타입을 .svg 파일로 강제
  type?: 'button' | 'submit';
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
  ariaLabel: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
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
    },
    ref
  ) => {
    const classes = styles({ variant, size, radius, disabled });

    return (
      <button
        ref={ref}
        className={clsx(className, classes)}
        disabled={disabled}
        type={type}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {React.cloneElement(icon, {
          className: clsx(icon.props.className, iconStyles({ size })),
          'aria-hidden': true,
        })}
      </button>
    );
  }
);

// displayName -> 디버깅용 이름을 명시적으로 지정
IconButton.displayName = 'IconButton';

export default IconButton;
