import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import { MODAL_TYPE, useModalStore } from '@/stores/modalStore';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';

const meta = {
  title: 'Components/Basics/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Modal 내부에 표시할 콘텐츠',
      defaultValue: '모달 내용',
    },
    type: {
      control: {
        type: 'select',
        options: Object.values(MODAL_TYPE),
      },
      description: 'Modal 타입 (store에서 관리되는 값)',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: args => {
    const StoryWrapper = () => {
      const { type: openType, open, close } = useModalStore();

      // args.type과 store 연동
      useEffect(() => {
        if (openType === args.type) return;
        close();
      }, [openType, close]);

      return (
        <>
          <Button label="모달 열기" onClick={() => open(args.type)} />
          <Modal {...args} />
        </>
      );
    };

    return <StoryWrapper />;
  },
  args: {
    children: <div>모달 내용</div>,
    type: 'ADD_LINK',
  },
};
