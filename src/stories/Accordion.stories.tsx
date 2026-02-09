import Accordion from '@/components/basics/Accordion/Accordion';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Basics/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    closeTitle: { control: 'text' },
    openTitle: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    closeTitle: '자세히',
    openTitle: '간략히',
    children: 'This is the content of the accordion.',
  },
};
