import LinkCard from '@/components/basics/LinkCard/LinkCard';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Basics/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // LinkCard는 그리드 셀을 채우는 유동형(w-full + aspect)이라, 단독 렌더 시 원래 디자인 폭을 준다.
  decorators: [
    Story => (
      <div className="w-[182px]">
        <Story />
      </div>
    ),
  ],
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
