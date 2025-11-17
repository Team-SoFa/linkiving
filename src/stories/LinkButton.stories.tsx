import LinkButton from '@/components/wrappers/wrappers/LinkButton/LinkButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LinkButton> = {
  title: 'Components/Wrappers/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    label: { control: 'text' },
    size: { control: 'inline-radio' },
    variant: { control: 'inline-radio' },
    radius: { control: 'inline-radio' },
    contextStyle: { control: 'inline-radio' },
    onClick: { action: '버튼 클릭' },
  },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {
  args: {
    href: 'https://google.com',
    label: '링크 버튼',
    size: 'md',
    variant: 'primary',
    radius: 'md',
    icon: 'IC_AllLink',
    contextStyle: 'onMain',
  },
};
