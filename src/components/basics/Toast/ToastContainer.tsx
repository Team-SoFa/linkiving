'use client';

import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, hideToast } = useToastStore();
  const modalType = useModalStore(state => state.type);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let portal = document.getElementById('toast-root');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'toast-root';
      document.body.appendChild(portal);
    }

    setPortalElement(portal);
  }, []);

  if (!portalElement || toasts.length === 0) return null;

  const isModalOpen = modalType !== null;
  const hasModalPlacementToast = toasts.some(toast => toast.placement === 'modal-bottom');
  const useModalLayout = isModalOpen || hasModalPlacementToast;

  return createPortal(
    <div
      className={clsx(
        'pointer-events-none fixed inset-0 z-[60] flex flex-col gap-3 px-4',
        useModalLayout ? 'items-center justify-end pb-[7.5rem]' : 'items-end pt-6'
      )}
    >
      <div className={clsx('flex flex-col gap-3', useModalLayout ? 'items-center' : 'items-end')}>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={hideToast} />
        ))}
      </div>
    </div>,
    portalElement
  );
};

export default ToastContainer;
