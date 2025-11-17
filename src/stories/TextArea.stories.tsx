// TextArea.stories.tsx
import TextArea, { TextAreaProps } from '@/components/basics/TextArea/TextArea';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';

const meta = {
  title: 'Components/Basics/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    placeholder: { control: 'text' },
    widthPx: { control: 'number', description: '가로 길이(px)' },
    heightLines: { control: 'number', description: '초기 줄 수' },
    maxHeightLines: { control: 'number', description: '최대 줄 수' },
    maxLength: {
      control: 'number',
      description: '최대 글자 수 지정',
    },
    radius: { control: 'inline-radio' },
    variant: { control: 'inline-radio' },
    textSize: { control: 'inline-radio' },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof TextArea>;

function InteractiveTextArea(props: TextAreaProps) {
  const [text, setText] = useState('');

  return (
    <TextArea
      {...props}
      value={text}
      onChange={e => setText(e.target.value)}
      onSubmit={props.onSubmit ?? fn()} // fn() 사용
    />
  );
}

export const Default: Story = {
  render: args => <InteractiveTextArea {...args} />,
  args: {
    placeholder: '무엇이든 물어보세요',
    widthPx: 250,
    heightLines: 3,
    maxHeightLines: 6,
    maxLength: 200,
  },
};
