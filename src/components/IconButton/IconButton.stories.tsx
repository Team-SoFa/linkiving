import CustomImage from '@/components/Icons/CustomImage';
import type { Meta, StoryObj } from '@storybook/react';

import IconButton from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio' },
    size: { control: 'inline-radio' },
    radius: { control: 'inline-radio' },
    onClick: {
      description: '아이콘만 가지는 버튼입니다.',
      action: 'clicked',
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    icon: <CustomImage src="file.svg" alt="img" />,
    ariaLabel: 'Icon Button',
    disabled: false,
  },
};
