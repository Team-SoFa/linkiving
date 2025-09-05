'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import Button from '../Button/Button';

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev => !prev);

  const navHeaderStyle = 'flex justify-between h-10';
  const menusStyle = 'flex flex-col gap-4 h-[85%]';

  const menuItems = [
    { icon: '🍊', label: 'Dashboard' },
    { icon: '📑', label: 'Documents' },
    { icon: '⚙️', label: 'Settings' },
    { icon: '❓', label: 'Help' },
  ];

  return (
    <motion.div
      animate={{ width: isOpen ? 320 : 48 }} // px 단위도 가능
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="fixed top-0 left-0 h-full z-40 bg-gray-200 rounded-r-lg overflow-hidden shadow-md"
    >
      <div>
        {/* 사이드 메뉴 헤더 */}
        <div className={navHeaderStyle}>
          <Button size="sm" onClick={toggle}>
            {isOpen ? '📕' : '📖'}
          </Button>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-semibold text-gray-700"
              >
                <Button>🔥</Button>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* 메뉴 아이템*/}
        <nav className={menusStyle}>
          {menuItems.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-3 px-3 hover:bg-gray-200 rounded-lg cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isOpen ? i * 0.05 : 0 }}
            >
              <span className="text-lg">{item.icon}</span>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-gray-700"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
        {/* 이후 폴더 리스트 렌더링 */}
      </div>
    </motion.div>
  );
}
