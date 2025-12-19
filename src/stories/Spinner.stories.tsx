import Spinner from '@/components/basics/Spinner/Spinner';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Basics/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio' },
    speed: { control: 'number' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'md',
    speed: 1,
  },
};
