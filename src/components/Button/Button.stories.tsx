// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'outline', 'ghost'],
    },
    size: {
      control: 'inline-radio',
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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    size: 'md',
    icon: '✈️',
    iconPosition: 'left',
    disabled: false, // 스토리북 데모 시 공유 API 미지원 브라우저 경고 억제
    onClick: undefined,
  },
};
