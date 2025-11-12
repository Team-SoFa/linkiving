import Label from '@/components/Label/Label';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
    },
    htmlFor: {
      control: 'text',
    },
    size: {
      control: 'select',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    text: 'Label',
    htmlFor: 'input-id',
    size: 'md',
    required: false,
  },
};
