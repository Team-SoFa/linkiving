import CardList from '@/components/basics/CardList/CardList';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Basics/CardList',
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
          <div key={i} className="h-60 w-full rounded-md bg-white p-4 shadow">
            📌 북마크 {i + 1}
          </div>
        ))}
      </>
    ),
  },
};
