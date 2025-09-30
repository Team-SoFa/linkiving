import { create } from 'zustand';

type ModalType = 'ex1' | 'ex2' | null;

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
