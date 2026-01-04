'use client';

import { Placement } from '@floating-ui/react-dom';
import React from 'react';

import PopoverProvider from './PopoverProvider';

interface PopoverProps {
  children: React.ReactNode;
  placement?: Placement;
}
const Popover = ({ children, placement = 'bottom-start' }: PopoverProps) => {
  return <PopoverProvider placement={placement}>{children}</PopoverProvider>;
};

export default Popover;
