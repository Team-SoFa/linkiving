'use client';

import TextArea from '@/components/basics/TextArea/TextArea';
import SendButton from '@/components/wrappers/SendButton';
import { useState } from 'react';

interface ChatQueryBoxProps {
  onSubmit: (e?: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatQueryBox = ({ onSubmit }: ChatQueryBoxProps) => {
  const [value, setValue] = useState('');

  return (
    <div className="relative">
      <TextArea
        heightLines={2}
        maxHeightLines={6}
        placeholder="저장한 링크에 대해 질문해 보세요."
        radius="lg"
        setBottomPlace
        value={value}
        onChange={e => setValue(e.target.value)}
        onSubmit={onSubmit}
        className="shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)]"
      />
      <SendButton disabled={!value} onClick={onSubmit} />
    </div>
  );
};

export default ChatQueryBox;
