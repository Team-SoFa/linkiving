// TextArea.stories.tsx
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
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
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

/**
 * - Enter: 입력 완료(onSubmit 호출)
 * - Shift+Enter: 줄바꿈
 */
function InteractiveTextArea({
  maxLength,
  placeholder,
  width,
  height,
}: {
  maxLength?: number;
  placeholder?: string;
  width?: 'sm' | 'md' | 'lg';
  height?: 'sm' | 'md' | 'lg';
}) {
  const [text, setText] = useState('');

  return (
    <TextArea
      value={text}
      onChange={e => setText(e.target.value)}
      onSubmit={action('Submitted')}
      placeholder={placeholder}
      maxLength={maxLength}
      width={width}
      height={height}
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
