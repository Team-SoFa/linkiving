import Tab from '@/components/basics/Tab/Tab';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Basics/Tab',
  component: Tab,
  tags: ['autodocs'],
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {
    tabs: ['답변', '링크', '단계'],
    contents: {
      답변: <div>답변 내용(예시)</div>,
      링크: <div>링크 내용(예시)</div>,
      단계: <div>단계 내용(예시)</div>,
    },
  },
};
