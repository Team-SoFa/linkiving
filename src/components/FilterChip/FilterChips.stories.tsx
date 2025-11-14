import { Meta, StoryObj } from '@storybook/react';

import FilterChips from './FilterChips';

const metaChips = {
  title: 'Components/FilterChip/FilterChips',
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
