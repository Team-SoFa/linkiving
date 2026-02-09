import FilterChipWrapper from '@/components/basics/FilterChip/FilterChipWrapper';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Basics/FilterChipWrapper',
  component: FilterChipWrapper,
  tags: ['autodocs'],
  argTypes: {
    initialChips: {
      description: '추후 서버로부터 Chip 데이터를 받아와 프린트할 예정',
    },
  },
} satisfies Meta<typeof FilterChipWrapper>;

export default meta;
type Story = StoryObj<typeof FilterChipWrapper>;

export const Default: Story = {
  args: {
    initialChips: [
      { id: 1, label: 'React' },
      { id: 2, label: 'Next.js' },
      { id: 3, label: 'TypeScript' },
    ],
  },
};
