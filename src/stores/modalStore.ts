import { create } from 'zustand';

export const MODAL_TYPE = {
  ADD_LINK: 'addLink',
  REPORT: 'report',
  SUMMARY: 'summary',
} as const;

export type ModalType = (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE] | null;

interface ModalStore {
  type: ModalType;
  isOpen: boolean;
  open: (type: ModalType) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  isOpen: false,
  open: type => set({ type, isOpen: true }),
  close: () => set({ type: null, isOpen: false }),
}));
