import GreetingBlock from '@/components/basics/GreetingBlock/GreetingBlock';
import { Meta, StoryObj } from '@storybook/react';

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
