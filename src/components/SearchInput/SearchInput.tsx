'use client';

import clsx from 'clsx';
import React from 'react';

import IconButton from '../IconButton/IconButton';
import CustomImage from '../Icons/CustomImage';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = '검색하세요',
  size = 'md',
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  const baseStyle =
    'flex justify-between pl-4 h-10 text-gray-800 bg-white placeholder-gray-400 rounded-full';
  const sizes = {
    md: 'w-70',
    lg: 'w-full',
  };
  const classes = clsx(baseStyle, sizes[size]);

  return (
    <form onSubmit={handleSubmit} className={classes}>
      <CustomImage src="file.svg" alt="img" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none ml-1"
      />
      <IconButton
        icon={<CustomImage src="globe.svg" alt="search button" />}
        ariaLabel="search button"
        radius="full"
      />
    </form>
  );
}
