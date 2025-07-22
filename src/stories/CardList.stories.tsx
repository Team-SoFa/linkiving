import CardList from '@/components/basics/CardList/CardList';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import type { Meta, StoryObj } from '@storybook/nextjs';

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
          <LinkCard
            key={i}
            imageUrl=""
            summary="요약입니다 요약입니다 요약입니다요약입니다 요약입니다 요약입니다."
            link="https://naver.com"
            title="예시링크카드"
          />
        ))}
      </>
    ),
  },
};
