import type { Meta, StoryObj } from '@storybook/react';

import Button from '../Button/Button';
import Tooltip from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    offset: { control: 'number' },
    delay: { control: 'number' },
    content: { control: 'text' },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Bottom: Story = {
  args: {
    content: '저장 버튼',
    side: 'bottom',
    offset: 12,
    delay: 80,
    children: <Button variant="primary">저장</Button>,
  },
};

export const Top: Story = {
  args: {
    content: '툴팁이 위에 표시됩니다',
    side: 'top',
    children: <Button variant="outline">위쪽</Button>,
  },
};

export const Left: Story = {
  args: {
    content: '툴팁이 왼쪽에 표시됩니다',
    side: 'left',
    children: <Button variant="ghost">왼쪽</Button>,
  },
};

export const Right: Story = {
  args: {
    content: '툴팁이 오른쪽에 표시됩니다',
    side: 'right',
    children: <Button variant="ghost">오른쪽</Button>,
  },
};
