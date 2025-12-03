import TitleTextArea from '@/components/wrappers/TitleTextArea/TitleTextArea';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta = {
  title: 'Components/Wrappers/TitleTextArea',
  component: TitleTextArea,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    onChange: { action: '텍스트 변경됨' },
  },
} satisfies Meta<typeof TitleTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// 훅 사용은 별도 컴포넌트에서 처리
const ControlledTitleTextArea = ({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange: (value: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <TitleTextArea
      value={value}
      onChange={newValue => {
        setValue(newValue);
        onChange?.(newValue);
      }}
    />
  );
};

export const Default: Story = {
  render: args => <ControlledTitleTextArea initialValue={args.value} onChange={args.onChange} />,
  args: {
    value: '초기 텍스트(백에서 받아옴)',
    onChange: () => {}, // 필수 prop
  },
};
