import type { Meta, StoryObj } from '@storybook/react';

import ShareButton from './ShareButton';

const meta: Meta<typeof ShareButton> = {
  title: 'Components/Button/ShareButton',
  component: ShareButton,
  tags: ['autodocs'],
  argTypes: {
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    icon: {
      control: false,
    },
    onClick: { action: '버튼 클릭' },
  },
};

export default meta;
type Story = StoryObj<typeof ShareButton>;

export const Default: Story = {
  args: {
    label: '공유하기',
    variant: 'primary',
    size: 'md',
    icon: '🔗',
    iconPosition: 'left',
    disabled: false,
  },
};
