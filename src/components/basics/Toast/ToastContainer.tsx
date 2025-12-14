'use client';

import { useToastStore } from '@/stores/toastStore';
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
    <div className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-end gap-3 px-4 pt-6">
      <div className="flex flex-col items-end gap-3">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={hideToast} />
        ))}
      </div>
    </div>,
    portalElement
  );
};

export default ToastContainer;
