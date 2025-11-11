// src/components/Tooltip/Tooltip.stories.tsx
import Button from '@/components/basics/Button/Button';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Basics/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        autoplay: false,
        height: '200px',
      },
    },
  },
  argTypes: {
    delay: { control: 'number' },
    content: { control: 'text' },
    children: { control: false },
  },
  args: {
    content: '툴팁',
    delay: 80,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: '저장 버튼',
  },
  render: args => (
    <div className="pt-8">
      <Tooltip {...args}>
        <Button variant="primary" label="저장" />
      </Tooltip>
    </div>
  ),
};
