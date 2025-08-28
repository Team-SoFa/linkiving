// Toast.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

// 컴포넌트 파일 import
import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    // id는 토스트 내부 관리용이므로 Storybook 컨트롤에서 숨기고 기본값으로 제공
    id: {
      control: false,
      description: '토스트의 고유 ID',
    },
    message: {
      // ReactNode 타입이므로 컨트롤을 지정하지 않고 args에서 직접 JSX 또는 문자열을 할당
      description: '토스트에 표시될 내용 (ReactNode 타입: 텍스트, JSX, 이미지, 이모지 등)',
    },
    variant: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
      description: '토스트의 종류 (시각적 스타일 결정)',
    },
    duration: {
      control: { type: 'number', min: 0 }, // 0 또는 양의 정수만 허용
      description: '토스트가 자동으로 닫히는 시간 (밀리초). 0이면 수동으로 닫아야 함',
    },
    onClose: {
      // 함수형 props는 action: "설명"을 사용하여 Storybook Actions 탭에 출력되도록 함
      action: 'onClose event',
      description: '토스트가 닫힐 때 호출되는 콜백 함수',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    id: 'story-toast-id-001', // Storybook 데모를 위한 고유 ID
    message: '성공적으로 설정이 저장되었습니다!',
    variant: 'success',
    duration: 3000, // 3초 후 자동 닫힘
    // onClose는 argTypes에서 action으로 정의했으므로 여기에 다시 명시하지 않음
  },
};
