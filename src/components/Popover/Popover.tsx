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
  const { isOpen, type: currentType, close } = usePopoverStore();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Popper 위치 계산
  useEffect(() => {
    if (!isOpen || currentType !== type) return;

    if (triggerRef.current && popoverRef.current) {
      const popperInstance = createPopper(triggerRef.current, popoverRef.current, {
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
  }, [isOpen, currentType, placement, triggerRef, type]);

  // 외부 클릭 및 ESC 키 닫기
  useEffect(() => {
    if (!isOpen || currentType !== type) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, currentType, close, triggerRef, type]);

  if (!isOpen || currentType !== type) return null;

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
