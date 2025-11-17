import MemoTextArea from '@/components/wrappers/MemoTextArea/MemoTextArea';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta = {
  title: 'Components/Wrappers/MemoTextArea',
  component: MemoTextArea,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    onChange: { action: '텍스트 변경됨' },
  },
} satisfies Meta<typeof MemoTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// 훅 사용은 별도 컴포넌트에서 처리
const ControlledMemoTextArea = ({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange: (value: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <MemoTextArea
      value={value}
      onChange={newValue => {
        setValue(newValue);
        onChange(newValue);
      }}
    />
  );
};

export const Default: Story = {
  render: args => <ControlledMemoTextArea initialValue={args.value} onChange={args.onChange} />,
  args: {
    value: '초기 텍스트(백에서 받아옴)',
    onChange: () => {}, // 필수 prop
  },
};
