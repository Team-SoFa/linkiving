import FilterChips from '@/components/basics/FilterChip/FilterChips';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const metaChips = {
  title: 'Components/Basics/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof FilterChips>;

export default metaChips;
type StoryChips = StoryObj<typeof FilterChips>;

export const DefaultChip: StoryChips = {
  args: {
    label: 'React',
  },
};
