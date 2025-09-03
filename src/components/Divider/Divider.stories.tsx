import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Divider from './Divider';

const meta = {
  title: 'Components/Divider',
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
      description: '세로/가로 방향 지정',
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    width: { description: '선 두께(px)', control: { type: 'number' } },
    color: { description: '색상(#000000)', control: { type: 'color' } },
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
    color: '#d8d8d8',
  },
};
