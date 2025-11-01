import Button from '@/components/Button/Button';
import { useModalStore } from '@/stores/modalStore';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';

import ExampleModal from './ExampleModal';

const meta = {
  title: 'Components/Modal/ExampleModal',
  component: ExampleModal,
  tags: ['autodocs'],
} satisfies Meta<typeof ExampleModal>;

export default meta;

type Story = StoryObj<typeof ExampleModal>;

export const Default: Story = {
  render: () => {
    const StoryWrapper = () => {
      const { open, close } = useModalStore();

      // 스토리 렌더 시점에 자동으로 모달 닫힘 방지
      useEffect(() => {
        return () => close();
      }, [close]);

      return (
        <>
          <Button onClick={() => open('EXAMPLE')} label="모달 열기" />
          <ExampleModal />
        </>
      );
    };

    return <StoryWrapper />;
  },
};
