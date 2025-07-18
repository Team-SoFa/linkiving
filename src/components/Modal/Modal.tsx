'use client';

import { MODAL_TYPE, useModalStore } from '@/stores/modalStore';
import clsx from 'clsx';
import { HTMLAttributes, ReactNode, forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Divider from '../Divider/Divider';
import IconButton from '../IconButton/IconButton';
import {
  modalBodyStyle,
  modalContentStyle,
  modalHeaderStyle,
  modalOverlayStyle,
} from './Modal.style';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  type: keyof typeof MODAL_TYPE;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  { className, children, type, ...rest },
  ref
) {
  const { type: openType, close } = useModalStore();
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // 포털 렌더링을 위한 div 체크
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let portalDiv = document.getElementById('modal-root');
      if (!portalDiv) {
        portalDiv = document.createElement('div');
        portalDiv.id = 'modal-root';
        document.body.appendChild(portalDiv);
      }
      setPortalElement(portalDiv);
    }
  }, []);

  if (openType !== type) return null;
  if (!portalElement) return null;

  return createPortal(
    <div ref={ref} className={clsx(modalOverlayStyle(), className)} onClick={close} {...rest}>
      <div className={modalContentStyle()} onClick={e => e.stopPropagation()}>
        <div className={modalHeaderStyle()}>
          <IconButton
            icon="IC_Close"
            size="sm"
            variant="tertiary"
            ariaLabel="modal close button"
            onClick={close}
          />
        </div>
        <Divider color="gray200" />
        <div className={modalBodyStyle()}>{children}</div>
      </div>
    </div>,
    portalElement
  );
});

export default Modal;
