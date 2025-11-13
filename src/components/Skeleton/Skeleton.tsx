'use client';

import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import React, { forwardRef } from 'react';
import { type VariantProps, tv } from 'tailwind-variants';

const styles = tv({
  base: 'skeleton',
  variants: {
    radius: {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    animated: {
      true: 'animate-pulse',
      false: '',
    },
  },
  defaultVariants: {
    radius: 'md',
    animated: true,
  },
});

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof styles> {
  asChild?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { asChild, radius = 'md', animated = true, width, height, className, style, ...rest },
  ref
) {
  const Comp = asChild ? Slot : 'div';
  const classes = styles({ radius, animated });

  const sizeStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <Comp
      ref={ref}
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={clsx(className, classes)}
      style={sizeStyle}
      {...rest}
    />
  );
});

export default Skeleton;
