import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import SideNavItemPopover from './SideNavItemPopover';

const meta: Meta<typeof SideNavItemPopover> = {
  title: 'Components/SideNavItemPopover',
  component: SideNavItemPopover,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: { type: 'radio' },
      options: [
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'right-start',
        'right-end',
        'left-start',
        'left-end',
      ],
      description: '컨텐츠 위치를 설정',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SideNavItemPopover>;

export const Default: Story = {
  args: {
    placement: 'right-start', // 기본값
  },
  render: args => <SideNavItemPopover {...args} />,
};
