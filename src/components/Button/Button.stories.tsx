// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    icon: {
      control: false,
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
    icon: '✈️',
    iconPosition: 'left',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'md',
    icon: '✈️',
    iconPosition: 'left',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
    icon: '✈️',
    iconPosition: 'left',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'ghost',
    size: 'md',
    disabled: true,
    icon: '✈️',
    iconPosition: 'left',
  },
};
