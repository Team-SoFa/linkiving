// TextArea.stories.tsx
import TextArea, { TextAreaProps } from '@/components/TextArea/TextArea';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    placeholder: { control: 'text' },
    width: {
      control: { type: 'radio' },
    },
    height: {
      control: { type: 'radio' },
    },
    maxLength: {
      control: 'number',
      description: '최대 글자 수 지정',
    },
    radius: {
      control: { type: 'inline-radio' },
    },
    variant: {
      control: { type: 'inline-radio' },
    },
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
    width: 'md',
    height: 'md',
    maxLength: 200,
  },
};
