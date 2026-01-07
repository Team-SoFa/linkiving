'use client';

import TextArea from '@/components/basics/TextArea/TextArea';
import SendButton from '@/components/wrappers/SendButton';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function QueryBox({ value, onChange, onSubmit }: Props) {
  return (
    <div className="relative w-full">
      <TextArea
        heightLines={2}
        maxHeightLines={6}
        placeholder="저장한 링크에 대해 질문해 보세요."
        radius="lg"
        showMax
        value={value}
        onChange={e => onChange(e.target.value)}
        onSubmit={onSubmit}
        className="shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)]"
      />
      <SendButton disabled={!value.trim()} onClick={onSubmit} />
    </div>
  );
}
