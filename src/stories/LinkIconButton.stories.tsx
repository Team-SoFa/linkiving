import LinkIconButton from '@/components/IconButton/Wrappers/LinkIconButton';
import { IconMap } from '@/components/Icons/icons';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/LinkIconButton',
  component: LinkIconButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: '버튼 클릭됨' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'inline-radio' },
    variant: { control: 'inline-radio' },
    contextStyle: { control: 'inline-radio' },
    icon: { control: 'text', options: Object.keys(IconMap) },
    href: { control: 'text' },
  },
} satisfies Meta<typeof LinkIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    icon: 'IC_AllLink',
    size: 'md',
    ariaLabel: '전체 링크 버튼',
  },
};
