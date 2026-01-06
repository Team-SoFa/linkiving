'use client';

import { useOutsideClick } from '@/hooks/util/useOutsideClickHandler';
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { usePopover } from './PopoverContext';
import { usePopoverPosition } from './hooks/usePopoverPosition';

interface PopoverContentProps {
  children: (close: () => void) => React.ReactElement;
  popoverKey: string;
  className?: string;
}

const PopoverContent = ({ children, popoverKey, className }: PopoverContentProps) => {
  const { activeKey, anchorEl, placement, close } = usePopover();

  const isActive = activeKey === popoverKey;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    anchorRef.current = anchorEl ?? null;
  }, [anchorEl]);

  const { refs, floatingStyles } = usePopoverPosition(anchorRef.current, isActive, placement);

  useOutsideClick([contentRef, anchorRef], close, isActive);

  if (!isActive) return null;

  return createPortal(
    <div
      ref={node => {
        refs.setFloating(node);
        contentRef.current = node;
      }}
      style={floatingStyles}
      className={clsx(
        'border-gray100 bg-gray50 z-50 m-1 rounded-2xl border shadow-[0_1px_3px_1px_rgba(0,0,0,0.08),0_1px_5px_2px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      {children(close)}
    </div>,
    document.body
  );
};

export default PopoverContent;
