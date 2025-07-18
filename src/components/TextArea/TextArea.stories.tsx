// TextArea.stories.tsx
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import TextArea, { TextAreaProps } from './TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    onSubmit: { action: 'submit' },
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

/**
 * - Enter: 입력 완료(onSubmit 호출)
 * - Shift+Enter: 줄바꿈
 */
function InteractiveTextArea(props: TextAreaProps) {
  const [text, setText] = useState('');

  return (
    <TextArea
      {...props}
      value={text}
      onChange={e => setText(e.target.value)}
      onSubmit={props.onSubmit ?? action('submit')}
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
