import Footer from '@/components/Footer/Footer';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
