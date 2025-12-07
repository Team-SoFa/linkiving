import Spinner from '@/components/basics/Spinner/Spinner';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Basics/Spinner',
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
