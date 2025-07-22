import LinkCard from '@/components/basics/LinkCard/LinkCard';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Basics/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    imageUrl: { control: 'text' },
    isHaveSummary: { control: 'boolean' },
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
    isHaveSummary: false,
    link: 'https://naver.com',
    summary: 'This is a sample bookmark card with a placeholder image.',
    title: 'Link Title',
    onClick: () => console.log('click'),
  },
};
