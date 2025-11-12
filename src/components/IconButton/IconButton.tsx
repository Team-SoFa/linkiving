'use client';

import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import React from 'react';

import SVGIcon from '../Icons/SVGIcon';
import { IconMapTypes, IconSizeTypes } from '../Icons/icons';
import { style } from './IconButton.style';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  asChild?: boolean;
  className?: string;
  icon: IconMapTypes; // icon 타입을 .svg 파일로 강제
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  contextStyle?: 'onPanel' | 'onMain'; // neutral 버튼에서만 사용 (내부적으로 강제됨)

  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    asChild = false,
    children,
    className,
    icon,
    type = 'button',
    variant = 'primary',
    contextStyle = 'onMain',
    size = 'md',
    disabled = false,
    ariaLabel,
    onClick,
    ...rest
  },
  ref
) {
  // STYLES
  const classes = style({ variant, contextStyle, size, disabled });
  const iconSize: IconSizeTypes = size;

  // 인터랙션 요소 중첩 방지를 위해 Slot 적용
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      className={clsx(classes, className)}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      {...rest}
    >
      {asChild ? (
        children
      ) : (
        <SVGIcon icon={icon} size={iconSize} className="flex-shrink-0" aria-hidden="true" />
      )}
    </Comp>
  );
});

export default IconButton;
