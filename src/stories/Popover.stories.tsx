import IconButton from '@/components/basics/IconButton/IconButton';
import PopoverContent from '@/components/basics/Popover/Content';
import Popover from '@/components/basics/Popover/Popover';
import PopoverTrigger from '@/components/basics/Popover/Trigger';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Basics/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

export const Default: StoryObj<typeof Popover> = {
  render: args => (
    <div className="m-20">
      <Popover {...args}>
        <PopoverTrigger popoverKey="trigger1" label="Open Popover">
          <IconButton icon="IC_AllLink" ariaLabel="아이콘버튼" />
        </PopoverTrigger>
        <PopoverContent popoverKey="trigger1">
          <div className="cursor-pointer hover:bg-gray-50">Popover Content</div>
          <div className="cursor-pointer hover:bg-gray-50">Popover Content</div>
          <div className="cursor-pointer hover:bg-gray-50">Popover Content</div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
