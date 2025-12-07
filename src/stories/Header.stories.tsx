import Header from '@/components/basics/Header/Header';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Header> = {
  title: 'Components/Basics/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <Header />,
};
