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
  },
  argTypes: {
    side: { control: 'select' },
    offset: { control: 'number' },
    delay: { control: 'number' },
    content: { control: 'text' },
    children: { control: false }, // children은 render에서만 구성
  },
  args: {
    content: '툴팁',
    side: 'bottom',
    offset: 12,
    delay: 80,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Bottom: Story = {
  args: {
    content: '저장 버튼',
    side: 'bottom',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="primary" label="저장" />
    </Tooltip>
  ),
};

export const Top: Story = {
  args: {
    content: '툴팁이 위에 표시됩니다',
    side: 'top',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="primary" label="위쪽" />
    </Tooltip>
  ),
};

export const Left: Story = {
  args: {
    content: '툴팁이 왼쪽에 표시됩니다',
    side: 'left',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="primary" label="왼쪽" />
    </Tooltip>
  ),
};

export const Right: Story = {
  args: {
    content: '툴팁이 오른쪽에 표시됩니다',
    side: 'right',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="primary" label="오른쪽" />
    </Tooltip>
  ),
};

export const DisabledButton: Story = {
  args: {
    content: '활성화되지 않은 상태',
    side: 'top',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="primary" label="비활성" disabled />
    </Tooltip>
  ),
};
