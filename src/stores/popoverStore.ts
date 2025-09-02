import { create } from 'zustand';

export const POPOVER_TYPE = {
  EXAMPLE: 'example',
} as const;

export type PopoverType = keyof typeof POPOVER_TYPE | null;

interface PopoverStore {
  type: PopoverType;
  props?: Record<string, unknown>;
  open: (type: PopoverType, props?: Record<string, unknown>) => void;
  close: () => void;
}

export const usePopoverStore = create<PopoverStore>(set => ({
  type: null,
  open: (type, props) => set({ type, props }),
  close: () => set({ type: null, props: undefined }),
}));
