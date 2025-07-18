import type { Meta, StoryObj } from '@storybook/react';

import ModalWrapper from './ModalWrapper';

const meta = {
  title: 'Components/ModalWrapper',
  component: ModalWrapper,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
    children: {
      control: { type: 'text' },
      description: 'Modal 내부에 표시할 콘텐츠',
      defaultValue: '모달 내용',
    },
  },
} satisfies Meta<typeof ModalWrapper>;

export default meta;

type Story = StoryObj<typeof ModalWrapper>;

export const Default: Story = {
  args: {
    children: <div>모달 내용</div>,
  },
};
