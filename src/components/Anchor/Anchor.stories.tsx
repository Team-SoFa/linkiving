import { Meta, StoryObj } from '@storybook/react';

import Anchor from './Anchor';

const meta = {
  title: 'Components/Anchor',
  component: Anchor,
  tags: ['autodocs'],
  argTypes: {
    iconVisible: {
      control: { type: 'boolean' },
    },
    href: { control: 'text' },
    target: {
      description: '링크 오픈 방식',
      control: { type: 'select', options: ['_self', '_blank', '_parent', '_top'] },
    },
    rel: {
      description: '링크 관계/보안/SEO 목적',
      control: {
        type: 'select',
        options: ['noopener', 'noreferrer', 'nofollow', 'noopener noreferrer', 'ugc', 'sponsored'],
      },
    },
    ariaLabel: { description: '접근성', control: 'text' },
  },
} satisfies Meta<typeof Anchor>;

export default meta;
type Story = StoryObj<typeof Anchor>;

export const Default: Story = {
  args: {
    iconVisible: true,
    ariaLabel: 'Example link',
    children: 'Example Link',
    href: 'https://example.com',
    rel: 'noopener',
    target: '_self',
  },
};
