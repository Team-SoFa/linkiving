// TextArea.stories.tsx
import TextArea, { TextAreaProps } from '@/components/basics/TextArea/TextArea';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

const meta = {
  title: 'Components/Basics/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    placeholder: { control: 'text' },
    heightLines: { control: 'number', description: '초기 줄 수' },
    maxHeightLines: { control: 'number', description: '최대 줄 수' },
    maxLength: {
      control: 'number',
      description: '최대 글자 수 지정',
    },
    setBottomPlace: { control: 'boolean', description: '최대 글자 수 보임 여부' },
    radius: { control: 'inline-radio' },
    color: { control: 'inline-radio' },
    textSize: { control: 'inline-radio' },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
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
      onSubmit={props.onSubmit}
    />
  );
}

export const Default: Story = {
  render: args => <InteractiveTextArea {...args} />,
  args: {
    placeholder: '무엇이든 물어보세요',
    color: 'white',
    heightLines: 3,
    maxHeightLines: 6,
    maxLength: 200,
  },
};

export const Disabled: Story = {
  render: args => <InteractiveTextArea {...args} />,
  args: {
    placeholder: '',
    color: 'white',
    heightLines: 3,
    maxHeightLines: 6,
    disabled: true,
  },
};

export const Loading: Story = {
  render: args => <InteractiveTextArea {...args} />,
  args: {
    placeholder: '로딩 중',
    color: 'white',
    heightLines: 3,
    maxHeightLines: 6,
    isLoading: true,
  },
};
