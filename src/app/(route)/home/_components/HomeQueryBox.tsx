'use client';

import TextArea from '@/components/basics/TextArea/TextArea';
import SendButton from '@/components/wrappers/SendButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HomeQueryBox = () => {
  const [value, setValue] = useState('');
  const route = useRouter();

  const handleSubmit = async () => {
    if (!value) return;
    route.push('/chat');
  };

  return (
    <div className="relative">
      <TextArea
        heightLines={2}
        maxHeightLines={6}
        placeholder="저장한 링크에 대해 질문해 보세요."
        radius="lg"
        value={value}
        onChange={e => setValue(e.target.value)}
        onSubmit={handleSubmit}
        className="shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)]"
      />
      <SendButton disabled={!value} onClick={handleSubmit} />
    </div>
  );
};

export default HomeQueryBox;
