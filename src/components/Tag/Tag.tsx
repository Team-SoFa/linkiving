'use client';

import React from 'react';

interface TagProps {
  children: React.ReactNode;
  onDelete?: () => void;
}

export default function Tag({ children, onDelete }: TagProps) {
  const baseStyle =
    'inline-flex items-center pl-2 pr-1 py-1 text-xs font-medium rounded-md text-gray-900 bg-gray-300 cursor-default';
  const buttonStyle =
    'px-1 ml-0.5 text-gray-700 transition-colors rounded-full duration-200 ease-in-out hover:bg-gray-600 hover:text-white hover:cursor-pointer';

  return (
    <div className={baseStyle}>
      <span> {children} </span>
      <button className={buttonStyle} aria-label="remove tag" onClick={onDelete}>
        x
      </button>
    </div>
  );
}
