'use client';

import { PopoverType, usePopoverStore } from '@/stores/popoverStore';
import { Placement } from '@floating-ui/react-dom';
import clsx from 'clsx';
import React from 'react';
import { createPortal } from 'react-dom';

import { usePopoverPosition } from './hooks/usePopoverPosition';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  children: React.ReactNode;
  type: PopoverType;
  label: string;
  placement?: Placement;
  className?: string;
}

const Popover = ({
  trigger,
  children,
  type,
  label,
  placement = 'bottom-start',
  className,
}: PopoverProps) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { type: currentType, anchorEl, open, close } = usePopoverStore();
  const isActive = currentType === type && anchorEl === buttonRef.current;
  const portalElement = typeof window !== 'undefined' ? document.body : null;
  const { refs, floatingStyles } = usePopoverPosition(buttonRef, isActive, placement);

  // 키보드 입력 처리
  React.useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (refs.floating.current && !refs.floating.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isActive, close, refs.floating]);

  // trigger 엘리먼트에 ref, onClick 주입
  const triggerWithProps = React.cloneElement(trigger, {
    ref: buttonRef,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      trigger.props.onClick?.(e);
      if (buttonRef.current) open(type, buttonRef.current);
    },
    'aria-label': label,
    'aria-expanded': isActive,
    'aria-haspopup': 'true',
  } as React.ButtonHTMLAttributes<HTMLButtonElement> & { ref: React.RefObject<HTMLButtonElement> });

  return (
    <>
      {/* Popover Trigger Button */}
      {triggerWithProps}
      {/* Popover Content */}
      {isActive &&
        portalElement &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={clsx('border-gray200 z-50 rounded-md border bg-white shadow-sm', className)}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </div>,
          portalElement
        )}
    </>
  );
};

export default Popover;
