'use client';

import React from 'react';

import './Modal.css';

// import IconButton from "@/components/IconButton/IconButton";

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalWrapper({ children, onClose }: ModalWrapperProps) {
  const baseStyle = 'fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center';
  const modalStyle =
    'relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[50vh] overflow-y-auto custom-scrollbar';

  return (
    <div className={baseStyle} onClick={onClose}>
      <div className={modalStyle} onClick={e => e.stopPropagation()}>
        <button // 추후 IconButton으로 변경 예정
          className="absolute top-2 right-2 text-gray-900 hover:cursor-pointer"
          onClick={onClose}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
}
