import Button from '@/components/Button/Button';
import Popover, { PopoverProps } from '@/components/Popover/Popover';
import { usePopoverStore } from '@/stores/popoverStore';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef } from 'react';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'radio' },
      description: 'Popover 내용 타입',
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
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof Popover>;

function PopoverStory(args: PopoverProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { open, close, type: currentType } = usePopoverStore(); // 스토어에서 open 가져오기
  const isOpen = currentType === args.type;

  const handleToggle = () => {
    if (isOpen) {
      close();
    } else {
      open(args.type); // ✅ props에 triggerRef 전달 안 함
    }
  };

  return (
    <div className="p-10">
      <Button ref={buttonRef} label="open popover" onClick={handleToggle} />
      <Popover {...args} triggerRef={buttonRef}>
        <ul className="min-w-[120px] rounded-md bg-white p-2 shadow-md">
          <li className="cursor-pointer px-3 py-2 text-black hover:bg-gray-100">Edit</li>
          <li className="cursor-pointer px-3 py-2 text-black hover:bg-gray-100">Delete</li>
        </ul>
      </Popover>
    </div>
  );
}

export const Default: Story = {
  args: {
    type: 'EXAMPLE',
    placement: 'bottom-start',
  },
  render: PopoverStory,
};
