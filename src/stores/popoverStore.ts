import { create } from 'zustand';

export type PopoverType = 'sideNavItemMenu' | 'linkcardMenu' | null;

interface PopoverStore {
  type: PopoverType;
  isOpen: boolean;
  open: (type: PopoverType) => void;
  close: () => void;
}

export const usePopoverStore = create<PopoverStore>(set => ({
  type: null,
  isOpen: false,
  open: type => set({ type, isOpen: true }),
  close: () => set({ type: null, isOpen: false }),
}));
