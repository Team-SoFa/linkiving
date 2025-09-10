import type { Meta, StoryObj } from '@storybook/react';

import Spinner from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number' },
    strokeWidth: { control: 'number' },
    color: { control: 'color' },
    speed: { control: 'number' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 40,
    strokeWidth: 6,
    color: '#6f00ff',
    speed: 1.6,
  },
};
