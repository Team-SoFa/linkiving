import { create } from 'zustand';

export const POPOVER_TYPE = {
  EXAMPLE: 'example',
} as const;

export type PopoverType = keyof typeof POPOVER_TYPE | null;

interface PopoverStore {
  anchorEl?: HTMLElement | null; // Record<string, unknown> 대신
  type?: PopoverType;
  open: (type: PopoverType, anchorEl: HTMLElement) => void;
  close: () => void;
}

export const usePopoverStore = create<PopoverStore>(set => ({
  type: null,
  anchorEl: null,
  open: (type, anchorEl) => set({ type, anchorEl }),
  close: () => set({ type: null, anchorEl: null }),
}));
