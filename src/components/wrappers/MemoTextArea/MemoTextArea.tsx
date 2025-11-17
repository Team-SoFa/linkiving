import TextArea from '@/components/basics/TextArea/TextArea';
import React from 'react';

interface MemoTextAreaProps {
  value: string;
  onChange: (value: string) => void;
}

const MemoTextArea = ({ value, onChange }: MemoTextAreaProps) => {
  return (
    <TextArea
      value={value}
      widthPx={480}
      heightLines={2}
      maxHeightLines={6}
      maxLength={200}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default MemoTextArea;
