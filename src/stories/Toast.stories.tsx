import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Toast from '../components/basics/Toast/Toast';

const meta = {
  title: 'Components/Basics/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: { disable: true },
      description: '토스트의 고유 ID',
    },
    message: {
      control: 'text',
      description: '토스트에 표시될 내용 (ReactNode 타입: 텍스트, JSX, 이미지, 이모지 등)',
    },
    variant: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
      description: '토스트의 종류 (시각적 스타일 결정)',
    },
    duration: {
      control: { type: 'range', min: 0, max: 10000, step: 500 },
      description: '토스트가 자동으로 닫히는 시간 (밀리초). 0이면 수동으로 닫아야 함',
    },
    onClose: {
      action: 'onClose event',
      description: '토스트가 닫힐 때 호출되는 콜백 함수',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    id: 'story-toast-id-001', // Storybook 데모를 위한 고유 ID
    message: '성공적으로 설정이 저장되었습니다!',
    variant: 'success',
    duration: 3000, // 3초 후 자동 닫힘
  },
};

export const ManualClose: Story = {
  args: {
    id: 'story-toast-id-002',
    message: 'duration=0 → 수동으로 닫아주세요.',
    variant: 'info',
    duration: 0,
  },
};

export const AllVariants: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 8 }}>
      {(['success', 'error', 'info', 'warning'] as const).map(v => (
        <Toast key={v} {...args} id={`variant-${v}`} variant={v} message={`${v} 메시지`} />
      ))}
    </div>
  ),
  args: { duration: 0 },
  parameters: { controls: { exclude: ['id', 'onClose'] } },
};
