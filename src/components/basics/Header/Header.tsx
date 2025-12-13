'use client';

import { useClickOutside } from '@reactuses/core';
import clsx from 'clsx';
import React from 'react';

import Button from '../Button/Button';
import { useHeader } from './hooks/useHeader';

export default function Header() {
  const { isElevated, isMenuOpen, toggleMenu, closeMenu } = useHeader();
  const menuRef = React.useRef<HTMLElement | null>(null);
  const toggleButtonRef = React.useRef<HTMLButtonElement | null>(null);

  useClickOutside(
    menuRef,
    event => {
      const target = event.target;
      if (target instanceof Node && toggleButtonRef.current?.contains(target)) {
        return;
      }
      closeMenu();
    },
    isMenuOpen
  );

  return (
    <header
      className={clsx(
        'sticky top-0 z-30 w-full bg-blue-200/80 p-4 backdrop-blur-sm transition-[box-shadow,backdrop-filter]',
        isElevated && 'shadow-lg backdrop-blur-lg'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Button label="BTN" />
        <div className="flex items-center gap-2">
          <Button label="더보기" />
          <Button label="로그인" />
          <Button
            ref={toggleButtonRef}
            label={isMenuOpen ? '메뉴 닫기' : '메뉴'}
            variant="secondary"
            onClick={toggleMenu}
          />
        </div>
      </div>
      {isMenuOpen && (
        <nav
          ref={menuRef}
          className="mt-3 rounded-lg bg-white/80 p-4 text-sm text-gray-700 shadow-inner"
        >
          <p className="mb-2 font-semibold">빠른 작업</p>
          <ul className="space-y-1">
            <li>
              <button type="button" className="hover:underline" onClick={closeMenu}>
                태그 관리
              </button>
            </li>
            <li>
              <button type="button" className="hover:underline" onClick={closeMenu}>
                링크 추가
              </button>
            </li>
            <li>
              <button type="button" className="hover:underline" onClick={closeMenu}>
                설정
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
