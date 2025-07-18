'use client';

import { MODAL_TYPE, useModalStore } from '@/stores/modalStore';
import clsx from 'clsx';
import { HTMLAttributes, ReactNode, forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Divider from '../Divider/Divider';
import IconButton from '../IconButton/IconButton';

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
    <div
      ref={ref}
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]',
        className
      )}
      onClick={close}
      {...rest}
    >
      <div
        className={'relative h-auto w-auto rounded-[19px] bg-white shadow-lg'}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex h-[34px] w-full items-center justify-end py-5 pr-2">
          <IconButton icon="IC_Close" ariaLabel="modal close button" onClick={close} />
        </div>
        <Divider />
        <div className="p-4">{children}</div>
      </div>
    </div>,
    portalElement
  );
});

export default Modal;
