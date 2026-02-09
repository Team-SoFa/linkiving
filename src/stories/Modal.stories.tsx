import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import { MODAL_TYPE, useModalStore } from '@/stores/modalStore';
import type { Meta, StoryObj } from '@storybook/nextjs';
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

      const handleOpen = () => {
        // 타입에 따라 적절한 props 전달
        if (args.type === 'DELETE_CHAT') {
          open('DELETE_CHAT', { chatId: 1 }); // DELETE_CHAT은 props 필수
        } else if (args.type === 'ADD_LINK') {
          open('ADD_LINK');
        } else if (args.type === 'RE_SUMMARY') {
          open('RE_SUMMARY');
        } else if (args.type === 'REPORT') {
          open('REPORT');
        }
      };

      return (
        <>
          <Button label="모달 열기" onClick={handleOpen} />
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
