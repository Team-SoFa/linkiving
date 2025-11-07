'use client';

import React from 'react';

import Divider from '../Divider/Divider';
import { contentStyle, tabDividerStyle, tabStyle } from './Tab.style';
import TabMenu from './TabMenu';
import { useTab } from './hooks/useTab';

interface TabProps {
  tabs: string[];
  contents: Record<string, React.ReactNode>;
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(function Tab(
  { tabs, contents, ...props },
  ref
) {
  const { activeTab, handleTabClick } = useTab(tabs[0]);
  return (
    <div ref={ref} className={tabStyle()} {...props}>
      <TabMenu
        menus={tabs}
        onClick={e => handleTabClick((e.target as HTMLButtonElement).innerText)}
        activeTab={activeTab}
      />
      <div className={tabDividerStyle()}>
        <Divider />
      </div>
      {/* 탭에 따라 콘텐츠 변경 */}
      <div className={contentStyle()}>{contents[activeTab] ?? null}</div>
    </div>
  );
});

export default Tab;
