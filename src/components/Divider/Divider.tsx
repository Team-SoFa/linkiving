'use client';

import React, { CSSProperties } from 'react';

interface DividerProps {
  dividerStyle?: CSSProperties;
  width?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
}

const Divider = ({
  dividerStyle,
  width = 1,
  orientation = 'horizontal',
  color = '#d8d8d8',
}: DividerProps) => {
  // color값을 어떤 식으로 받을지 확정이 안나 임의로 string으로 받은 후, Hex인지 검사하여 강제
  const isHexColor = (value: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
  if (color && !isHexColor(color))
    console.warn(`Divider: color prop shold be a HEX value, got "${color}"`);

  const dividerStyles: CSSProperties = {
    width: orientation === 'horizontal' ? '100%' : width,
    height: orientation === 'vertical' ? '100%' : width,
    backgroundColor: color,
    ...dividerStyle,
  };

  return <div style={dividerStyles} />;
};

export default Divider;
