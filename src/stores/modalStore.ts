import { create } from 'zustand';

export const MODAL_TYPE = {
  ADD_LINK: 'ADD_LINK',
  RE_SUMMARY: 'RE_SUMMARY',
  REPORT: 'REPORT',
  DELETE_CHAT: 'DELETE_CHAT',
} as const;

type ModalProps = {
  ADD_LINK?: Record<string, unknown>;
  RE_SUMMARY?: Record<string, unknown>;
  REPORT?: Record<string, unknown>;
  DELETE_CHAT: { chatId: number };
};

export type ModalType = keyof typeof MODAL_TYPE | null;

interface ModalStore {
  type: ModalType;
  props?: ModalProps[keyof ModalProps];
  // 함수 오버로딩
  open(type: 'ADD_LINK', props?: ModalProps['ADD_LINK']): void;
  open(type: 'RE_SUMMARY', props?: ModalProps['RE_SUMMARY']): void;
  open(type: 'REPORT', props?: ModalProps['REPORT']): void;
  open(type: 'DELETE_CHAT', props: ModalProps['DELETE_CHAT']): void;
  close: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  props: undefined,
  open: ((type: keyof typeof MODAL_TYPE, props?: ModalProps[keyof ModalProps]) => {
    set({ type, props });
  }) as ModalStore['open'],
  close: () => set({ type: null, props: undefined }),
}));
