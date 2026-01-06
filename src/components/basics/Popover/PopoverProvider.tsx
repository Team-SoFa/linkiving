'use client';

import { Placement } from '@floating-ui/react-dom';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { PopoverContext } from './PopoverContext';

const PopoverProvider = ({ children, placement }: PropsWithChildren<{ placement: Placement }>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const open = useCallback((key: string, anchor: HTMLElement) => {
    setActiveKey(key);
    setAnchorEl(anchor);
  }, []);

  const close = useCallback(() => {
    setActiveKey(null);
    setAnchorEl(null);
  }, []);

  const toggle = useCallback(
    (key: string, anchor: HTMLElement) => {
      if (activeKey === key && anchorEl === anchor) close();
      else open(key, anchor);
    },
    [activeKey, anchorEl, close, open]
  );

  const value = useMemo(
    () => ({
      anchorEl,
      activeKey,
      placement,
      open,
      close,
      toggle,
    }),
    [anchorEl, activeKey, placement, open, close, toggle]
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
};

export default PopoverProvider;
