import Anchor from '@/components/basics/Anchor/Anchor';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Basics/Anchor',
  component: Anchor,
  tags: ['autodocs'],
  argTypes: {
    iconVisible: {
      control: { type: 'boolean' },
    },
    href: { control: 'text' },
    target: {
      description: '링크 오픈 방식',
      control: { type: 'select' },
    },
    rel: {
      description: '링크 관계/보안/SEO 목적',
      control: {
        type: 'select',
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
