import Badge from '@/components/basics/Badge/Badge';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Basics/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    label: 'Badge Label',
    icon: 'IC_SumGenerate',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    label: 'Badge Label',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Badge Label',
    icon: 'IC_SumGenerate',
  },
};
