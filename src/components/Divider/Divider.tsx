'use client';

import React, { CSSProperties, HTMLAttributes } from 'react';

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  width?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { width = 1, orientation = 'horizontal', color = '#d8d8d8', ...props },
  ref
) {
  // color값을 어떤 식으로 받을지 확정이 안나 임의로 string으로 받은 후, Hex인지 검사하여 강제
  const isHexColor = (value: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
  if (color && !isHexColor(color))
    console.warn(`Divider: color prop should be a HEX value, got "${color}"`);

  const thickness = Math.max(0, Number.isFinite(width) ? width : 1);
  const dividerStyles: CSSProperties = {
    width: orientation === 'horizontal' ? '100%' : thickness,
    height: orientation === 'vertical' ? '100%' : thickness,
    backgroundColor: color,
  };

  return (
    <div
      ref={ref}
      style={dividerStyles}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
});

export default Divider;
