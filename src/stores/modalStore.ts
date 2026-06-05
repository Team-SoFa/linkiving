import type { EntityId } from '@/types/id';
import { create } from 'zustand';

export const MODAL_TYPE = {
  ADD_LINK: 'ADD_LINK',
  RE_SUMMARY: 'RE_SUMMARY',
  REPORT: 'REPORT',
  DELETE_CHAT: 'DELETE_CHAT',
  DELETE_LINK: 'DELETE_LINK',
} as const;

export type ModalType = keyof typeof MODAL_TYPE | null;
type ModalState =
  | { type: null; props?: undefined }
  | { type: 'ADD_LINK'; props?: Record<string, unknown> }
  | { type: 'RE_SUMMARY'; props: { linkId: EntityId } }
  | { type: 'REPORT'; props?: Record<string, unknown> }
  | { type: 'DELETE_CHAT'; props: { chatId: EntityId; title: string } }
  | { type: 'DELETE_LINK'; props: { linkIds: EntityId[] } };

type NonNullModalState = Exclude<ModalState, { type: null }>;
type ModalProps<T extends NonNullModalState['type']> = Extract<
  NonNullModalState,
  { type: T }
>['props'];
type OpenModalArgs<T extends NonNullModalState['type']> =
  undefined extends ModalProps<T>
    ? [props?: Exclude<ModalProps<T>, undefined>]
    : [props: ModalProps<T>];
type OpenModal = <T extends NonNullModalState['type']>(type: T, ...args: OpenModalArgs<T>) => void;

interface ModalStore {
  modal: ModalState;
  open: OpenModal;
  close: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  modal: { type: null },
  open: ((type: NonNullModalState['type'], ...args: [unknown?]) => {
    const [props] = args;
    set({ modal: { type, props } as ModalState });
  }) as ModalStore['open'],
  close: () => set({ modal: { type: null } }),
}));
