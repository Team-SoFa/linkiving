import type { Meta, StoryObj } from '@storybook/react';

import CardList from './CardList';

const meta: Meta<typeof CardList> = {
  title: 'Components/CardList',
  component: CardList,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'CardList 내부에 렌더링할 요소',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardList>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
        <div className="p-4 bg-white rounded-md w-60 h-60 shadow">📌 북마크 1</div>
      </>
    ),
  },
};
