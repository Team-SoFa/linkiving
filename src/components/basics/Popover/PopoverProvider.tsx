'use client';

import { useOutsideClick } from '@/hooks/util/useOutsideClickHandler';
import { Placement } from '@floating-ui/react-dom';
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PopoverContext } from './PopoverContext';

const PopoverProvider = ({ children, placement }: PropsWithChildren<{ placement: Placement }>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const popoverRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    anchorRef.current = anchorEl;
  }, [anchorEl]);

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

  useOutsideClick(
    [popoverRef, anchorRef],
    () => {
      close();
    },
    Boolean(activeKey)
  );

  const value = useMemo(
    () => ({
      anchorEl,
      activeKey,
      placement,
      open,
      close,
      toggle,
      popoverRef,
    }),
    [anchorEl, activeKey, placement, open, close, toggle]
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
};

export default PopoverProvider;
