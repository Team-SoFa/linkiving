'use client';

import { POPOVER_TYPE, usePopoverStore } from '@/stores/popoverStore';
import { Placement } from '@floating-ui/react-dom';
import clsx from 'clsx';
import { HTMLAttributes, ReactNode, forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { usePopoverPosition } from './hooks/usePopoverPosition';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  placement?: Placement;
  type: keyof typeof POPOVER_TYPE;
  triggerRef: React.RefObject<HTMLElement | null>; // 기준 요소
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover({
  className,
  children,
  placement = 'bottom-start',
  type,
  triggerRef,
  ...rest
}) {
  const { type: currentType, close } = usePopoverStore();
  const isActive = currentType === type;
  const portalElement = typeof window !== 'undefined' ? document.body : null;

  // 기준 요소(triggerRef)로 위치 계산
  const { refs, floatingStyles } = usePopoverPosition(triggerRef, isActive, placement);

  useEffect(() => {
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

  if (!isActive || !portalElement) return null;

  return createPortal(
    <div
      ref={refs.setFloating} // Popover 본체
      style={floatingStyles}
      className={clsx('border-gray200 z-50 rounded-md border bg-white shadow-lg', className)}
      onClick={e => e.stopPropagation()}
      {...rest}
    >
      {children}
    </div>,
    portalElement
  );
});

export default Popover;
