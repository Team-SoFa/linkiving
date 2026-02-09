import { IconMap } from '@/components/Icons/icons';
import Button from '@/components/basics/Button/Button';
import type { Meta, StoryObj } from '@storybook/nextjs';

const ICONS = Object.keys(IconMap);

const meta = {
  title: 'Components/Basics/Button',
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
      table: { type: { summary: 'string' } },
    },
    contextStyle: {
      description: 'neutral 버튼에서만 사용 (내부적으로 강제됨)',
      control: 'inline-radio',
      table: { type: { summary: 'string' } },
    },
    radius: {
      control: 'inline-radio',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'inline-radio',
      table: { type: { summary: 'string' } },
    },
    icon: {
      options: [undefined, ...ICONS],
      table: { type: { summary: 'IconMapTypes' } },
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
    contextStyle: 'onMain',
    size: 'md',
    disabled: false,
  },
};
