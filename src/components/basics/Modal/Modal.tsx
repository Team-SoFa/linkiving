'use client';

import { MODAL_TYPE, useModalStore } from '@/stores/modalStore';
import clsx from 'clsx';
import { HTMLAttributes, ReactNode, forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Divider from '../Divider/Divider';
import IconButton from '../IconButton/IconButton';
import {
  modalBodyStyle,
  modalContentStyle,
  modalHeaderStyle,
  modalOverlayStyle,
} from './Modal.style';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  type: keyof typeof MODAL_TYPE;
  ariaLabel?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  { className, children, type, ariaLabel, ...rest },
  ref
) {
  const { modal, close } = useModalStore();
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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

  // 모달이 열릴 때 이전 포커스 저장 후 모달 첫 요소에 포커스
  useEffect(() => {
    if (modal.type !== type) return;
    previousFocusRef.current = document.activeElement as HTMLElement;

    const frame = requestAnimationFrame(() => {
      const focusable = contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      focusable?.[0]?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus();
    };
  }, [modal.type, type]);

  // Tab / Shift+Tab 트랩
  useEffect(() => {
    if (modal.type !== type) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 다른 레이어(Dropdown, Popover 등)가 먼저 처리하도록 우선순위 확인
        // 또는 stopImmediatePropagation으로 후속 핸들러 차단
        e.stopImmediatePropagation();
        close();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ?? []
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modal.type, type, close]);

  if (modal.type !== type) return null;
  if (!portalElement) return null;

  return createPortal(
    <div ref={ref} className={modalOverlayStyle()} onClick={close} {...rest}>
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={clsx(modalContentStyle(), className)}
        onClick={e => e.stopPropagation()}
      >
        <div className={modalHeaderStyle()}>
          <IconButton
            icon="IC_Close"
            size="sm"
            variant="tertiary_subtle"
            ariaLabel="모달 닫기 버튼"
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
