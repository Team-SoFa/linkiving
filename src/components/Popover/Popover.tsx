'use client';

import { PopoverType, usePopoverStore } from '@/stores/popoverStore';
import { Placement, createPopper } from '@popperjs/core';
import React, { useEffect, useRef } from 'react';

export interface PopoverProps {
  children: React.ReactNode;
  type: PopoverType;
  triggerRef: React.RefObject<HTMLElement | null>;
  placement?: Placement;
}

export default function Popover({
  children,
  type,
  triggerRef,
  placement = 'bottom-start',
}: PopoverProps) {
  const { isOpen, type: currentType, close, anchorEl } = usePopoverStore();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Popper 위치 계산
  useEffect(() => {
    if (!isOpen || currentType !== type || anchorEl !== triggerRef.current) return;

    if (anchorEl && popoverRef.current) {
      const popperInstance = createPopper(anchorEl, popoverRef.current, {
        placement,
        modifiers: [
          {
            name: 'flip',
            options: { fallbackPlacements: ['left-start', 'bottom-start', 'top-start'] },
          },
        ],
      });
      return () => popperInstance.destroy();
    }
  }, [isOpen, currentType, placement, triggerRef, type, anchorEl]);

  // 외부 클릭 및 ESC 키 닫기
  useEffect(() => {
    if (!isOpen || anchorEl !== triggerRef.current) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
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
  }, [isOpen, currentType, close, triggerRef, type, anchorEl]);

  if (!isOpen || anchorEl !== triggerRef.current) return null;

  return (
    <div
      ref={popoverRef}
      className="z-50"
      onClick={e => e.stopPropagation()} // 외부 클릭과 겹치지 않게
    >
      {children}
    </div>
  );
}
