import CustomImage from '@/components/Icons/CustomImage';
import type { Meta, StoryObj } from '@storybook/react';

import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      description: '아이콘만 가지는 버튼입니다.',
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'solid',
    size: 'md',
    radius: 'md',
    icon: <CustomImage src="file.svg" alt="img" />,
    ariaLabel: 'Icon Button',
    disabled: false,
  },
};
