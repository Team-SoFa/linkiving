import type { Meta, StoryObj } from '@storybook/react';

import BookmarkCard from './BookmarkCard';

const meta: Meta<typeof BookmarkCard> = {
  title: 'Components/BookmarkCard',
  component: BookmarkCard,
  tags: ['autodocs'],
  argTypes: {
    imageUrl: { control: 'text' },
    title: { control: 'text' },
    summary: { control: 'text' },
    link: { control: 'text' },
    onClick: { action: 'open details panel' },
  },
};
export default meta;

type Story = StoryObj<typeof BookmarkCard>;

export const Default: Story = {
  args: {
    imageUrl: '/globe.svg',
    title: 'Link Title',
    summary: 'This is a sample bookmark card with a placeholder image.',
    link: 'https://naver.com',
  },
};
