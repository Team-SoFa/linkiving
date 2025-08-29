import { Meta, StoryObj } from '@storybook/react';

import FilterChips from './FilterChips';

const metaChips: Meta<typeof FilterChips> = {
  title: 'Components/FilterChip/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
  },
};

export default metaChips;
type StoryChips = StoryObj<typeof FilterChips>;

export const DefaultChip: StoryChips = {
  args: {
    label: 'React',
  },
};
