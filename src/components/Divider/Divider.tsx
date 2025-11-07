'use client';

import clsx from 'clsx';
import React, { CSSProperties, HTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: 'divider',
  variants: {
    orientation: {
      horizontal: 'divider-horizontal',
      vertical: 'divider-vertical',
    },
    color: {
      gray100: 'divider-gray100',
      gray200: 'divider-gray200',
      gray300: 'divider-gray300',
      blue: 'divider-blue',
      transBlue: 'divider-trans-blue',
    },
  },
});
export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  width?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: 'gray100' | 'gray200' | 'gray300' | 'blue' | 'transBlue';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { className, width = 1, orientation = 'horizontal', color = 'gray100', ...props },
  ref
) {
  // 두께 동적 스타일링 적용
  const thickness = Math.max(0, Number.isFinite(width) ? width : 1);
  const dynamicStyle: CSSProperties =
    orientation === 'horizontal' ? { height: `${thickness}px` } : { width: `${thickness}px` };

  const classes = styles({ orientation, color });

  return (
    <div
      ref={ref}
      className={clsx(classes, className)}
      style={dynamicStyle}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
});

export default Divider;
