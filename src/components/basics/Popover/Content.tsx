'use client';

import clsx from 'clsx';
import React from 'react';
import { createPortal } from 'react-dom';

import { usePopover } from './PopoverContext';
import { usePopoverPosition } from './hooks/usePopoverPosition';

interface PopoverContentProps {
  children: React.ReactNode;
  popoverKey: string;
  className?: string;
}

const PopoverContent = ({ children, popoverKey, className }: PopoverContentProps) => {
  const { activeKey, anchorEl, placement } = usePopover();

  const triggerRef = anchorEl ?? null;
  const isActive = activeKey === popoverKey;

  const { refs, floatingStyles } = usePopoverPosition(triggerRef, isActive, placement);

  if (!isActive) return null;

  const portalEl = typeof window !== 'undefined' ? document.body : null;

  return portalEl
    ? createPortal(
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={clsx(
            'border-gray100 bg-gray50 z-50 m-1 rounded-2xl border shadow-[0_1px_3px_1px_rgba(0,0,0,0.08),0_1px_5px_2px_rgba(0,0,0,0.02)]',
            className
          )}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>,
        portalEl
      )
    : null;
};

export default PopoverContent;
