import type { Meta, StoryObj } from '@storybook/react';

import BookmarkCard from './BookmarkCard';

const meta = {
  title: 'Components/BookmarkCard',
  component: BookmarkCard,
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
} satisfies Meta<typeof BookmarkCard>;
export default meta;

type Story = StoryObj<typeof BookmarkCard>;

export const Default: Story = {
  args: {
    imageUrl: 'globe.svg',
    isHaveSummary: false,
    link: 'https://naver.com',
    summary: 'This is a sample bookmark card with a placeholder image.',
    title: 'Link Title',
  },
};
