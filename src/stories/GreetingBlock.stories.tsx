import GreetingBlock from '@/components/basics/GreetingBlock/GreetingBlock';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Basics/GreetingBlock',
  component: GreetingBlock,
  tags: ['autodocs'],
  argTypes: {
    context: {
      control: 'text',
    },
    typingSpeed: {
      control: 'number',
    },
  },
} satisfies Meta<typeof GreetingBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    context: 'home',
    typingSpeed: 80,
  },
};
