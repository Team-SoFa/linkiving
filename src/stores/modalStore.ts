import { create } from 'zustand';

export const MODAL_TYPE = {
  ADD_LINK: 'ADD_LINK',
  RE_SUMMARY: 'RE_SUMMARY',
  REPORT: 'REPORT',
  DELETE_CHAT: 'DELETE_CHAT',
  DELETE_LINK: 'DELETE_LINK',
} as const;

type ModalProps = {
  ADD_LINK?: Record<string, unknown>;
  RE_SUMMARY?: Record<string, unknown>;
  REPORT?: Record<string, unknown>;
  DELETE_CHAT: { chatId: number; title: string };
  DELETE_LINK: { linkIds: number[] };
};

export type ModalType = keyof typeof MODAL_TYPE | null;

type ModalState =
  | { type: null; props: undefined }
  | { type: 'ADD_LINK'; props?: ModalProps['ADD_LINK'] }
  | { type: 'RE_SUMMARY'; props?: ModalProps['RE_SUMMARY'] }
  | { type: 'REPORT'; props?: ModalProps['REPORT'] }
  | { type: 'DELETE_CHAT'; props: ModalProps['DELETE_CHAT'] }
  | { type: 'DELETE_LINK'; props: ModalProps['DELETE_LINK'] };

type ModalStore = ModalState & {
  open(type: 'ADD_LINK', props?: ModalProps['ADD_LINK']): void;
  open(type: 'RE_SUMMARY', props?: ModalProps['RE_SUMMARY']): void;
  open(type: 'REPORT', props?: ModalProps['REPORT']): void;
  open(type: 'DELETE_CHAT', props: ModalProps['DELETE_CHAT']): void;
  open(type: 'DELETE_LINK', props: ModalProps['DELETE_LINK']): void;
  close: () => void;
};

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  props: undefined,
  open: ((type: keyof typeof MODAL_TYPE, props?: ModalProps[keyof ModalProps]) => {
    set({ type, props } as ModalState);
  }) as ModalStore['open'],
  close: () => set({ type: null, props: undefined }),
}));
