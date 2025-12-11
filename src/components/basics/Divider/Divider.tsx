'use client';

import clsx from 'clsx';
import React, { CSSProperties, HTMLAttributes } from 'react';

import { style } from './Divider.style';

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  width?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: 'gray100' | 'gray200' | 'gray300' | 'blue';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    className,
    width = 1,
    orientation = 'horizontal',
    color = 'gray100',
    style: inlineStyle,
    ...props
  },
  ref
) {
  // Guarantee at least 1px thickness even if width prop is 0/undefined.
  const thickness = Math.max(1, Number.isFinite(width) ? Number(width) : 1);
  const dynamicStyle: CSSProperties =
    orientation === 'horizontal' ? { height: `${thickness}px` } : { width: `${thickness}px` };

  // Inline color fallback so divider is visible even if CSS layers are skipped.
  const colorMap: Record<NonNullable<DividerProps['color']>, string> = {
    gray100: 'var(--color-gray100)',
    gray200: 'var(--color-gray200)',
    gray300: 'var(--color-gray300)',
    blue: 'var(--color-gray400)',
  };

  const classes = style({ orientation, color });
  const mergedStyle: CSSProperties = {
    ...dynamicStyle,
    minHeight: `${thickness}px`,
    backgroundColor: colorMap[color] ?? colorMap.gray200,
    ...inlineStyle,
  };

  return (
    <div
      ref={ref}
      className={clsx(classes, 'flex-shrink-0', className)}
      style={mergedStyle}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
});

export default Divider;
