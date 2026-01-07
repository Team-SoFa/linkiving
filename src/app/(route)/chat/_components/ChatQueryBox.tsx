'use client';

import QueryBox from '@/components/wrappers/QueryBox';
import { useState } from 'react';

interface ChatQueryBoxProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

const ChatQueryBox = ({ onSubmit, disabled = false }: ChatQueryBoxProps) => {
  const [value, setValue] = useState('');
  const handleSubmit = () => {
    const nextValue = value.trim();
    if (!nextValue || disabled) return;
    onSubmit(nextValue);
    setValue('');
  };

  return <QueryBox value={value} onChange={setValue} onSubmit={handleSubmit} />;
};

export default ChatQueryBox;
