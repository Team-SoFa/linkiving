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
  const { isOpen, type, open, close } = usePopoverStore();

  const togglePopover = () => {
    if (isOpen && type === menuType) {
      close();
    } else {
      open(menuType);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <IconButton
        icon={<span>🔽</span>}
        ariaLabel="Open menu"
        ref={buttonRef}
        onClick={togglePopover}
      />

      {/* Popover Content */}
      <Popover type={menuType} triggerRef={buttonRef} placement={placement}>
        <ul className="bg-white shadow-md rounded-md p-2 m-1 min-w-[120px]">
          <li className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer">Edit</li>
          <li className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer">Delete</li>
        </ul>
      </Popover>
    </div>
  );
}
