'use client';

import Label from '@/components/basics/Label/Label';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import React from 'react';

import SVGIcon from '../../Icons/SVGIcon';
import { IconMapTypes, IconSizeTypes } from '../../Icons/icons';
import { style } from './Button.style';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onClick'> {
  asChild?: boolean;
  className?: string;
  icon?: IconMapTypes;
  label?: string;
  variant?: 'primary' | 'secondary' | 'teritary' | 'teritary_subtle';
  contextStyle?: 'onPanel' | 'onMain'; // teritary_subtle 버튼에서만 사용 (내부적으로 강제됨)
  radius?: 'md' | 'full';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    asChild = false,
    children,
    className,
    icon,
    label,
    type = 'button',
    variant = 'primary',
    contextStyle = 'onMain',
    radius = 'md',
    size = 'md',
    disabled = false,
    onClick,
    ...rest
  },
  ref
) {
  // STYLES
  const classes = style({
    variant,
    contextStyle,
    radius,
    size,
    disabled,
  });
  const iconSize: IconSizeTypes = size;
  const Comp = asChild ? Slot : 'button'; // 인터랙션 요소 중첩 방지를 위해 Slot 적용

  return (
    <Comp
      ref={ref}
      className={clsx(classes, className)}
      disabled={disabled}
      type={type}
      aria-disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {asChild ? (
        children
      ) : (
        <div className="flex items-center gap-x-1">
          {icon && <SVGIcon icon={icon} size={iconSize} />}
          <Label textSize={size} className={icon ? 'pr-1' : ''}>
            {label}
          </Label>
        </div>
      )}
    </Comp>
  );
});

export default Button;
