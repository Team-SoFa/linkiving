import Label, { LabelProps } from '@/components/basics/Label/Label';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Basics/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    textSize: { control: { type: 'inline-radio' } },
    textColor: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<LabelProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    textSize: 'md',
    textColor: 'text-black',
    children: '🔍 검색 라벨',
  },
};
