'use client';

import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import React from 'react';
import { tv } from 'tailwind-variants';

import SVGIcon from '../Icons/SVGIcon';
import { IconMapTypes, IconSizeTypes } from '../Icons/icons';

const styles = tv({
  base: 'btn',
  variants: {
    variant: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      tertiary: 'btn-tertiary',
      neutral: 'btn-neutral',
    },
    contextStyle: {
      // neutral 외 다른 variant에서는 무시됨
      onMain: '',
      onPanel: '',
    },
    radius: {
      md: 'rounded-lg',
      full: 'rounded-full',
    },
    size: {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    },
    disabled: {
      true: 'btn-disabled',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'neutral',
      contextStyle: 'onPanel',
      className: 'btn-neutral-onpanel',
    },
    {
      variant: 'neutral',
      contextStyle: 'onMain',
      className: 'btn-neutral-onmain',
    },
  ],
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onClick'> {
  asChild?: boolean;
  className?: string;
  icon?: IconMapTypes;
  iconPosition?: 'left' | 'right';
  label?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  contextStyle?: 'onPanel' | 'onMain'; // neutral 버튼에서만 사용 (내부적으로 강제됨)
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
    iconPosition = 'left',
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
  const classes = styles({
    variant,
    contextStyle,
    radius,
    size,
    disabled,
  });
  const iconSize: IconSizeTypes = size;

  // 인터랙션 요소 중첩 방지를 위해 Slot 적용
  const Comp = asChild ? Slot : 'button';

  // RENDERING
  const buttonIcon = icon ? (
    <span
      className={clsx('flex-shrink-0', {
        'mr-1': iconPosition === 'left',
        'ml-1': iconPosition === 'right',
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
    <Comp
      ref={ref}
      className={clsx(classes, className)}
      disabled={disabled}
      type={type}
      aria-disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {asChild ? children : content}
    </Comp>
  );
});

export default Button;
