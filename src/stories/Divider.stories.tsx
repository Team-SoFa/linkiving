import Divider from '@/components/basics/Divider/Divider';
import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

const meta = {
  title: 'Components/Basics/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '부모 컴포넌트 크기를 채우는 가로, 세로 선을 그립니다.',
      },
    },
  },
  argTypes: {
    orientation: {
      description: '가로/세로 방향 지정',
      control: { type: 'inline-radio' },
    },
    width: { description: '선 두께(px)', control: { type: 'number' } },
    color: { description: 'trans: hover 효과 있음', control: { type: 'inline-radio' } },
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof Divider>;

{
  /* vertical의 최소 높이를 주기 위해 render 작성 */
}
export const Default: Story = {
  render: args => (
    <div style={{ height: '100px', display: 'flex' }}>
      <Divider {...args} />
    </div>
  ),
  args: {
    orientation: 'horizontal',
    width: 1,
    color: 'gray100',
  },
};
