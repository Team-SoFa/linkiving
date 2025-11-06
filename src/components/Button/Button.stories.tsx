// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { IconMap } from '../Icons/icons';
import Button from './Button';

const ICONS = Object.keys(IconMap);

const meta = {
  title: 'Components/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '[텍스트] 및 [아이콘 포함 텍스트], children을 표시하는 버튼입니다.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'neutral'],
      table: { type: { summary: 'string' } },
    },
    radius: {
      control: 'inline-radio',
      options: ['md', 'full'],
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: 'string' } },
    },
    icon: {
      options: [undefined, ...ICONS],
      table: { type: { summary: 'IconMapTypes' } },
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
      table: { type: { summary: 'string' } },
    },
    type: { table: { disable: true } },
    className: { table: { disable: true } },
    onClick: { action: 'clicked', table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    size: 'md',
    iconPosition: 'left',
    disabled: false,
  },
};
