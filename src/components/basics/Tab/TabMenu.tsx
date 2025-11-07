'use client';

import React from 'react';

import Divider from '../Divider/Divider';
import { menuGroupStyle, tabMenuDividerStyle, tabMenuStyle, textStyle } from './TabMenu.style';

interface TabMenuProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  menus: string[];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  activeTab?: string;
}

const TabMenu = React.forwardRef<HTMLDivElement, TabMenuProps>(function TabMenu(
  { menus, onClick, activeTab, ...props },
  ref
) {
  return (
    <div className={tabMenuStyle()} role="tablist" ref={ref}>
      {menus.map((menu, index) => (
        <div key={`${menu}-${index}`} className={menuGroupStyle()}>
          <button
            className={textStyle()}
            onClick={onClick}
            role="tab"
            aria-selected={activeTab === menu}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            {...props}
          >
            {menu}
          </button>
          <div className="w-10">
            <Divider width={3} className={tabMenuDividerStyle({ active: activeTab === menu })} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default TabMenu;
