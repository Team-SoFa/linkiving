'use client';

import IconButton from '@/components/IconButton/IconButton';
import { usePopoverStore } from '@/stores/popoverStore';
import { Placement } from '@popperjs/core';
import React, { useRef } from 'react';

import Popover from '../../Popover';

interface SideNavItemPopoverProps {
  placement?: Placement;
}

export default function SideNavItemPopover({ placement = 'right-start' }: SideNavItemPopoverProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuType = 'sideNavItemMenu';
  const { isOpen, type, open, close, anchorEl } = usePopoverStore();

  const togglePopover = () => {
    const current = buttonRef.current;
    if (!current) return;
    if (!isOpen || type !== menuType) {
      open(menuType, current);
      return;
    }
    if (anchorEl === current) {
      close();
    } else {
      open(menuType, current); // 다른 앵커로 전환
    }
  };

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <IconButton
        icon={<span>🔽</span>}
        ref={buttonRef}
        onClick={togglePopover}
        ariaLabel="Open menu"
        // type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen && type === menuType && anchorEl === buttonRef.current}
      />

      {/* Popover Content */}
      <Popover type={menuType} triggerRef={buttonRef} placement={placement}>
        <ul
          className="bg-white shadow-md rounded-md p-2 m-1 min-w-[120px]"
          id="side-nav-item-popover"
          role="menu"
        >
          <li
            className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer"
            role="menu item-edit"
          >
            Edit
          </li>
          <li
            className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer"
            role="menu item-delete"
          >
            Delete
          </li>
        </ul>
      </Popover>
    </div>
  );
}
