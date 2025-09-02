import Button from '@/components/Button/Button';
import Popover, { PopoverProps } from '@/components/Popover/Popover';
import Example from '@/components/Popover/PopoverContents/Example';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'radio' },
      description: 'Popover 내용 타입',
    },
    label: {
      control: { type: 'text' },
    },
    placement: {
      control: { type: 'radio' },
      options: [
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'right-start',
        'right-end',
        'left-start',
        'left-end',
      ],
      description: '컨텐츠 위치를 설정',
    },
    trigger: {
      control: false,
      description: 'Popover를 열 버튼 엘리먼트',
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof Popover>;

function PopoverStory(args: PopoverProps) {
  return (
    <div className="p-10">
      <Popover {...args}>
        <Example />
      </Popover>
    </div>
  );
}

export const Default: Story = {
  args: {
    type: 'EXAMPLE',
    label: 'Open Example Popover',
    placement: 'bottom-start',
    trigger: <Button label="트리거버튼" />,
  },
  render: PopoverStory,
};
