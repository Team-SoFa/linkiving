import Button from '@/components/basics/Button/Button';
import ReSummaryModal from '@/components/wrappers/ReSummaryModal/ReSummaryModal';
import { useModalStore } from '@/stores/modalStore';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta = {
  title: 'Components/Wrappers/SummaryRegeneratingModal',
  component: ReSummaryModal,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ReSummaryModal>;

export default meta;

type Story = StoryObj<typeof ReSummaryModal>;

const StoryWrapper = () => {
  const { type, open } = useModalStore();

  return (
    <>
      <Button label="모달 열기" variant="primary" onClick={() => open('RE_SUMMARY')} />
      {type === 'RE_SUMMARY' && <ReSummaryModal />}
    </>
  );
};

export const Default: Story = {
  render: () => <StoryWrapper />,
};
