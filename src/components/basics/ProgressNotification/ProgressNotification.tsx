'use client';

import SVGIcon from '@/components/Icons/SVGIcon';
import type { IconMapTypes } from '@/components/Icons/icons';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

import { style } from './ProgressNotification.style';

export interface ProgressNotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  icon?: IconMapTypes;
  tone?: 'default' | 'accent';
  animated?: boolean;
}

const ProgressNotification = forwardRef<HTMLDivElement, ProgressNotificationProps>(
  (
    {
      label = 'progress notifications',
      icon = 'IC_SumGenerate',
      tone = 'default',
      animated = false,
      className,
      style: inlineStyle,
      ...rest
    },
    ref
  ) => {
    const classes = style({ tone, animated });

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={clsx(classes, className)}
        style={{ columnGap: 8, ...inlineStyle }}
        {...rest}
      >
        <SVGIcon icon={icon} size="lg" aria-hidden="true" />
        <span>{label}</span>
      </div>
    );
  }
);

ProgressNotification.displayName = 'ProgressNotification';

export default ProgressNotification;
