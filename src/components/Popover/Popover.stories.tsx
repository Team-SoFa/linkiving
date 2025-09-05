import { usePopoverStore } from '@/stores/popoverStore';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef } from 'react';

import Popover, { PopoverProps } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
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
};

export default meta;

type Story = StoryObj<typeof Popover>;

function PopoverStory(args: PopoverProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { open } = usePopoverStore(); // 👈 스토어에서 open 가져오기

  return (
    <div className="p-10">
      <button
        ref={buttonRef}
        className="px-3 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => open(args.type)} // 👈 스토어 열기 호출
      >
        🔽 Open Popover
      </button>
      <Popover {...args} triggerRef={buttonRef}>
        <ul className="bg-white shadow-md rounded-md p-2 min-w-[120px]">
          <li className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer">Edit</li>
          <li className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer">Delete</li>
        </ul>
      </Popover>
    </div>
  );
}

export const Default: Story = {
  render: PopoverStory,
};
