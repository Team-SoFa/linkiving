import { create } from 'zustand';

interface SideNavState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useSideNavStore = create<SideNavState>(set => ({
  isOpen: false,
  toggle: () => set(state => ({ isOpen: !state.isOpen })),
  setOpen: open => set({ isOpen: open }),
}));
