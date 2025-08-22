import FilterChips from '@/components/basics/FilterChip/FilterChips';
import { Meta, StoryObj } from '@storybook/react';

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
