'use client';

import QueryBox from '@/components/wrappers/QueryBox';
import { useState } from 'react';

interface ChatQueryBoxProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  inputDisabled?: boolean;
}

const ChatQueryBox = ({ onSubmit, disabled = false, inputDisabled = false }: ChatQueryBoxProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const nextValue = value.trim();
    if (!nextValue || disabled) return;
    onSubmit(nextValue);
    setValue('');
  };

  return (
    <QueryBox
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      disabled={disabled}
      inputDisabled={inputDisabled}
    />
  );
};

export default ChatQueryBox;
