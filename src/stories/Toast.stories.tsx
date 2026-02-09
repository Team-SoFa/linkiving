import type { Meta, StoryObj } from '@storybook/nextjs';

import Toast from '../components/basics/Toast/Toast';

const meta = {
  title: 'Components/Basics/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    id: { control: { disable: true }, description: '토스트의 고유 ID' },
    message: { control: 'text', description: '토스트에 표시할 메시지 (ReactNode 가능)' },
    variant: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
      description: '토스트의 상태',
    },
    duration: {
      control: { type: 'range', min: 0, max: 10000, step: 500 },
      description: '자동으로 닫히기까지의 시간(ms). 0이면 자동 닫힘 없음.',
    },
    actionLabel: { control: 'text', description: '우측 텍스트 버튼 라벨 (비우면 숨김)' },
    showIcon: { control: 'boolean', description: '좌측 상태 아이콘 노출 여부' },
    onClose: { action: 'onClose event', description: '토스트가 닫힐 때 호출' },
    onAction: { action: 'onAction event', description: '액션 버튼 클릭 시 호출' },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    id: 'story-toast-id-001',
    message: '성공적으로 완료되었습니다!',
    variant: 'success',
    actionLabel: 'button sm label',
    showIcon: true,
  },
};

export const EightCombinations: Story = {
  render: () => {
    const samples = [
      {
        id: 's1',
        variant: 'success',
        message: '성공 알림',
        showIcon: true,
        actionLabel: 'button sm label',
      },
      {
        id: 's2',
        variant: 'success',
        message: '성공 알림',
        showIcon: true,
        actionLabel: '',
      },
      {
        id: 'i1',
        variant: 'info',
        message: '안내 알림',
        showIcon: true,
        actionLabel: 'button sm label',
      },
      {
        id: 'i2',
        variant: 'info',
        message: '안내 알림',
        showIcon: true,
        actionLabel: '',
      },
      {
        id: 'w1',
        variant: 'warning',
        message: '경고 알림',
        showIcon: true,
        actionLabel: 'button sm label',
      },
      {
        id: 'w2',
        variant: 'warning',
        message: '경고 알림',
        showIcon: true,
        actionLabel: '',
      },
      {
        id: 'e1',
        variant: 'error',
        message: '에러 알림',
        showIcon: true,
        actionLabel: 'button sm label',
      },
      {
        id: 'e2',
        variant: 'error',
        message: '에러 알림',
        showIcon: true,
        actionLabel: '',
      },
    ] as const;

    return (
      <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
        {samples.map(sample => (
          <Toast
            key={sample.id}
            id={sample.id}
            message={sample.message}
            variant={sample.variant}
            actionLabel={sample.actionLabel}
            showIcon={sample.showIcon}
            onClose={() => {}}
            onAction={() => {}}
          />
        ))}
      </div>
    );
  },
};
