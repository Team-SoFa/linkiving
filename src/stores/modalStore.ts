import { create } from 'zustand';

export const MODAL_TYPE = {
  ADD_LINK: 'ADD_LINK',
  RE_SUMMARY: 'RE_SUMMARY',
} as const;

export type ModalType = keyof typeof MODAL_TYPE | null;

interface ModalStore {
  type: ModalType;
  props?: Record<string, unknown>;
  open: (type: ModalType, props?: Record<string, unknown>) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  props: undefined,
  open: (type, props) => set({ type, props }),
  close: () => set({ type: null, props: undefined }),
}));
