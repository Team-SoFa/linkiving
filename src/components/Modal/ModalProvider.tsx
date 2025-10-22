'use client';

import { MODAL_TYPE, useModalStore } from '@/stores/modalStore';

import ModalWrapper from './ModalWrapper';
import AddLinkModal from './Wrappers/AddLinkModal';
import ReportModal from './Wrappers/ReportModal';

export default function ModalProvider() {
  const { isOpen, type, close } = useModalStore();

  if (!isOpen) return null;

  let content;
  switch (type) {
    case MODAL_TYPE.ADD_LINK:
      content = <AddLinkModal />;
      break;
    case MODAL_TYPE.REPORT:
      content = <ReportModal />;
      break;
    default:
      content = null;
  }

  return <ModalWrapper onClose={close}>{content}</ModalWrapper>;
}
