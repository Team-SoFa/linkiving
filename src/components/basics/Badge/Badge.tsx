'use client';

import SVGIcon from '@/components/Icons/SVGIcon';
import type { IconMapTypes } from '@/components/Icons/icons';
import clsx from 'clsx';
import React from 'react';

import { style } from './Badge.style';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  icon?: IconMapTypes | null;
  variant?: 'primary' | 'neutral' | 'warning';
}

export default function Badge({
  label,
  icon,
  variant = 'primary',
  className,
  ...rest
}: BadgeProps) {
  const hasIcon = Boolean(icon);
  const classes = style({ variant, withIcon: hasIcon });

  return (
    <span className={clsx(classes, className)} role="status" aria-live="polite" {...rest}>
      {hasIcon && <SVGIcon icon={icon as IconMapTypes} size="sm" aria-hidden="true" />}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}
