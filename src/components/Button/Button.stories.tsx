// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import CustomImage from '../Icons/CustomImage';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
    },
    size: {
      control: 'inline-radio',
    },
    radius: {
      control: 'inline-radio',
    },
    iconPosition: {
      control: 'inline-radio',
    },
    icon: {
      control: false,
    },
    type: {
      control: 'inline-radio',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: 'Primary Button',
    icon: <CustomImage src="file.svg" width={16} />,
    iconPosition: 'left',
    variant: 'primary',
    disabled: false, // 스토리북 데모 시 공유 API 미지원 브라우저 경고 억제
    onClick: undefined,
  },
};
