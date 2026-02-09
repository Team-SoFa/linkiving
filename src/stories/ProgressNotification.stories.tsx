import { IconMap } from '@/components/Icons/icons';
import ProgressNotification from '@/components/basics/ProgressNotification/ProgressNotification';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Basics/ProgressNotification',
  component: ProgressNotification,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(IconMap),
    },
    tone: {
      control: 'inline-radio',
      options: ['default', 'accent'],
    },
    animated: { control: 'boolean' },
  },
} satisfies Meta<typeof ProgressNotification>;

export default meta;
type Story = StoryObj<typeof ProgressNotification>;

export const Default: Story = {
  args: {
    label: 'progress notifications',
    icon: 'IC_SumGenerate',
  },
};

export const Accent: Story = {
  name: 'Accent tone',
  args: {
    label: '응답을 생성 중이에요',
    tone: 'accent',
    animated: true,
    icon: 'IC_Regenerate',
  },
};
