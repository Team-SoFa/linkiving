'use client';

import TextArea from '@/components/basics/TextArea/TextArea';
import { useState } from 'react';
import { KeyboardEvent } from 'react';

import SendButton from './SendButton';

interface QueryBoxProps {
  onSubmit: (e?: KeyboardEvent<HTMLTextAreaElement> | undefined) => void;
}

const QueryBox = ({ onSubmit }: QueryBoxProps) => {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!value || isSending) return;
    try {
      setIsSending(true);
      setError('');
      await onSubmit();
      setValue('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'API error';
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative w-fit shadow-[0_2px_4px_rgba(0,0,0,0.04),_0_4px_8px_rgba(0,0,0,0.04)]">
      <TextArea
        heightLines={1}
        maxHeightLines={6}
        placeholder="Linkiving에게 물어보세요."
        radius="lg"
        value={value}
        widthPx={720}
        onChange={e => setValue(e.target.value)}
        onSubmit={onSubmit}
      />
      <SendButton disabled={!value || isSending} onClick={handleSubmit} />
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
};

QueryBox.displayName = 'QueryBox';
export default QueryBox;
