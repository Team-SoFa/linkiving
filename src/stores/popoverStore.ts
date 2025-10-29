import { create } from 'zustand';

export type PopoverType = 'sideNavItemMenu' | 'linkcardMenu';

interface PopoverStore {
  type: PopoverType | null;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  open: (type: PopoverType, anchorEl: HTMLElement) => void;
  close: () => void;
}

export const usePopoverStore = create<PopoverStore>(set => ({
  type: null,
  anchorEl: null,
  isOpen: false,
  open: (type, anchorEl) => set({ type, anchorEl, isOpen: true }),
  close: () => set({ type: null, anchorEl: null, isOpen: false }),
}));
