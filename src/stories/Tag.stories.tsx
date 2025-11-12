import Tag from '@/components/Tag/Tag';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    onDelete: { action: 'clicked delete' },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    label: 'Sample',
  },
};
