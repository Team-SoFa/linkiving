import { create } from 'zustand';

export const MODAL_TYPE = {
  ADD_LINK: 'ADD_LINK',
  RE_SUMMARY: 'RE_SUMMARY',
  REPORT: 'REPORT',
  DELETE_CHAT: 'DELETE_CHAT',
} as const;

export type ModalType = keyof typeof MODAL_TYPE | null;
type ModalState =
  | { type: null; props?: undefined }
  | { type: 'ADD_LINK'; props?: Record<string, unknown> }
  | { type: 'RE_SUMMARY'; props: { linkId: number } }
  | { type: 'REPORT'; props?: Record<string, unknown> }
  | { type: 'DELETE_CHAT'; props: { chatId: number; title: string } };

interface ModalStore {
  modal: ModalState;
  open(type: 'ADD_LINK', props?: Record<string, unknown>): void;
  open(type: 'RE_SUMMARY', props: { linkId: number }): void;
  open(type: 'REPORT', props?: Record<string, unknown>): void;
  open(type: 'DELETE_CHAT', props: { chatId: number; title: string }): void;
  close: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  modal: { type: null },
  open: ((type: ModalType, props?: unknown) => {
    set({ modal: { type, props } as ModalState });
  }) as ModalStore['open'],
  close: () => set({ modal: { type: null } }),
}));
