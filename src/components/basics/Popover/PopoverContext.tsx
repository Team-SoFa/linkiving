'use client';

import { Placement } from '@floating-ui/react-dom';
import { createContext, useContext } from 'react';

interface PopoverContextType {
  anchorEl?: HTMLElement | null;
  activeKey: string | null;
  placement: Placement;
  close: () => void;
  open: (key: string, anchor: HTMLElement) => void;
  toggle: (key: string, anchor: HTMLElement) => void;
}

export const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopover는 PopoverProvider 내부에서만 사용해야합니다.');
  }

  return context;
};
