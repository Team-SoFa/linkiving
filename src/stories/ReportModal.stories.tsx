import Button from '@/components/basics/Button/Button';
import ReportModal from '@/components/wrappers/ReposrtModal/ReportModal';
import { useModalStore } from '@/stores/modalStore';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta = {
  title: 'Components/Wrappers/ReportModal',
  component: ReportModal,
  tags: ['autodocs'],
} satisfies Meta<typeof ReportModal>;

export default meta;
type Story = StoryObj<typeof ReportModal>;

const StoryWrapper = () => {
  const { type, open } = useModalStore();
  return (
    <>
      <Button label="모달 열기" variant="primary" onClick={() => open('REPORT')} />
      {type === 'REPORT' && <ReportModal />}
    </>
  );
};

export const Default: Story = {
  render: () => <StoryWrapper />,
};
