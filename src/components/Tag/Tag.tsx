'use client';

import React from 'react';

import IconButton from '../IconButton/IconButton';
import CustomImage from '../Icons/CustomImage';

interface TagProps {
  children: React.ReactNode;
  onDelete?: () => void;
}

export default function Tag({ children, onDelete }: TagProps) {
  const baseStyle =
    'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-900 rounded-md bg-gray-300 cursor-default';
  return (
    <div className={baseStyle}>
      <span>{children}</span>
      {onDelete && (
        <IconButton
          icon={<CustomImage src="/globe.svg" width={16} height={16} />}
          size="sm"
          onClick={onDelete}
          ariaLabel={`${children} 태그 삭제`}
        />
      )}
    </div>
  );
}
