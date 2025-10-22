import type { Meta, StoryObj } from '@storybook/react';

import CardList from './CardList';

const meta = {
  title: 'Components/CardList',
  component: CardList,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'CardList 내부에 렌더링할 요소',
      control: false,
      table: { disable: true },
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CardList>;

export default meta;
type Story = StoryObj<typeof CardList>;

export const Default: Story = {
  args: {
    children: (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="p-4 bg-white rounded-md h-60 w-full shadow">
            📌 북마크 {i + 1}
          </div>
        ))}
      </>
    ),
  },
};
