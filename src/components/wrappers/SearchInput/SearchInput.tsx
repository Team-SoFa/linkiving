'use client';

import SVGIcon from '@/components/Icons/SVGIcon';
import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = '검색하세요',
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="placeholder-gray400 bg-blue50 flex h-10 w-full items-center justify-between rounded-full pl-4"
    >
      <SVGIcon icon="IC_Search" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ml-1 flex-1 bg-transparent outline-none"
      />
    </form>
  );
}
