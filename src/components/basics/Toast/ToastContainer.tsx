'use client';

import { useToastStore } from '@/stores/toastStore';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, hideToast } = useToastStore();
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

  return createPortal(
    <div
      className={clsx(
        // pb-30(120px)은 하단 입력창을 피하기 위한 값. 모바일에서는 홈 인디케이터만큼 더 띄운다.
        'pointer-events-none fixed inset-0 z-60 flex flex-col items-center justify-end gap-3 px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))]'
      )}
    >
      <div className="flex flex-col items-center gap-3">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={hideToast} />
        ))}
      </div>
    </div>,
    portalElement
  );
};

export default ToastContainer;
