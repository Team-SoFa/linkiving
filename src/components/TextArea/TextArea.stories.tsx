// TextArea.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';

import TextArea, { TextAreaProps } from './TextArea';

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
      options: ['sm', 'md', 'lg'],
    },
    height: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    maxLength: {
      control: 'number',
      description: '최대 글자 수 지정',
    },
    radius: {
      control: { type: 'inline-radio' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['default', 'surface'],
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
