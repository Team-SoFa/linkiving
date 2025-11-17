'use client';

import React from 'react';

import IconButton from '../IconButton/IconButton';

interface TagProps {
  label: string;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Tag({ label, onDelete }: TagProps) {
  return (
    <div className="inline-flex cursor-default items-center justify-center gap-1 rounded-md bg-gray-300 px-2 py-1 text-xs font-medium text-gray-900">
      <span>{label}</span>
      {onDelete && (
        <IconButton
          icon="IC_Close"
          variant="primary"
          size="sm"
          ariaLabel={label || `${label} 태그 삭제`}
          onClick={onDelete}
        />
      )}
    </div>
  );
}
