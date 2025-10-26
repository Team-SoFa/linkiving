import type { Meta, StoryObj } from '@storybook/react';

import IconButton from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '아이콘만 표시하는 버튼입니다.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', table: { type: { summary: 'string' } } },
    size: { control: 'inline-radio' },
    icon: {
      control: 'select',
      table: { type: { summary: 'IconMapTypes' } },
    },
    type: { control: 'inline-radio', table: { type: { summary: 'string' } } },
    radius: { control: 'inline-radio', table: { type: { summary: 'string' } } },
    className: { table: { disable: true } },
    onClick: { action: 'clicked', table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    icon: 'IC_AllLink',
    ariaLabel: 'Icon Button',
    disabled: false,
  },
};
