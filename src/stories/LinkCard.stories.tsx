import LinkCard from '@/components/basics/LinkCard/LinkCard';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Basics/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    imageUrl: { control: 'text' },
    title: { control: 'text' },
    summary: { control: 'text' },
    link: { control: 'text' },
    onClick: { action: 'open details panel' },
  },
} satisfies Meta<typeof LinkCard>;
export default meta;

type Story = StoryObj<typeof LinkCard>;

export const Default: Story = {
  args: {
    imageUrl: '',
    link: 'https://naver.com',
    summary: 'This is a sample bookmark card with a placeholder image.',
    title: 'Link Title',
    onClick: () => console.log('click'),
  },
};
