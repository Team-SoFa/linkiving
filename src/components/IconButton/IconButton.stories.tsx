import type { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';

import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['solid', 'outline'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: { type: 'radio' },
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    onClick: { action: 'clicked' },
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'solid',
    size: 'md',
    radius: 'md',
    icon: <Image src="/next.svg" alt="Next.js Icon" width={20} height={20} />,
    ariaLabel: 'Icon Button',
  },
};
