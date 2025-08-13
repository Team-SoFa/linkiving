'use client';

import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import Button from '../Button/Button';

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [tempOpen, setTempOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(prev => !prev);

  const navButtonStyle = 'absolute -right-10 top-0 w-8 h-8 flex hover:cursor-pointer';

  const baseStyle = clsx(
    'absolute flex flex-col left-0 top-0 w-80 h-full bg-gray-200 rounded-r-lg p-4 text-black',
    'transition-transform duration-300 z-50',
    isOpen || tempOpen ? 'translate-x-0' : '-translate-x-full'
  );

  const navHeaderStyle = 'flex justify-between h-10';
  const menusStyle = 'flex flex-col gap-4 h-[85%]';
  const navFooterStyle = 'absolute flex justify-end bottom-4 w-72 h-10';

  return (
    // temporary open state by hover
    <div
      ref={navRef}
      className="fixed top-0 left-0 h-full z-40"
      onMouseEnter={() => {
        if (!isOpen) setTempOpen(true);
      }}
      onMouseLeave={() => {
        if (!isOpen) setTempOpen(false);
      }}
      // w-80 = 20rem = 320px
      style={{ width: isOpen || tempOpen ? 320 : 3 }}
    >
      <aside className={baseStyle}>
        <nav className={navButtonStyle}>
          <Button size="sm" variant="ghost" onClick={toggle}>
            🐸
          </Button>
        </nav>
        <div className={navHeaderStyle}>
          <Button size="sm">Icon</Button>
          <Button>Icon</Button>
        </div>
        <p>----------------------</p>
        <nav className={menusStyle}>
          <Button>item</Button>
          <Button>item</Button>
          <Button>item</Button>
        </nav>
        <nav className={navFooterStyle}>
          <Button variant="ghost">✅</Button>
        </nav>
      </aside>
    </div>
  );
}
