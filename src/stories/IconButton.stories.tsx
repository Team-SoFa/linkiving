import IconButton from '@/components/basics/IconButton/IconButton';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Basics/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '아이콘만 표시하는 버튼입니다.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', table: { type: { summary: 'string' } } },
    contextStyle: {
      description: 'neutral 버튼에서만 사용 (내부적으로 강제됨)',
      control: 'inline-radio',
      table: { type: { summary: 'string' } },
    },
    size: { control: 'inline-radio' },
    icon: {
      control: 'select',
      table: { type: { summary: 'IconMapTypes' } },
    },
    type: { control: 'inline-radio', table: { type: { summary: 'string' } } },
    className: { table: { disable: true } },
    onClick: { action: 'clicked', table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'primary',
    contextStyle: 'onMain',

    size: 'md',
    icon: 'IC_AllLink',
    ariaLabel: 'Icon Button',
    disabled: false,
  },
};
