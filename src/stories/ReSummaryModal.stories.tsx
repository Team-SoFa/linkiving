import Button from '@/components/basics/Button/Button';
import ReSummaryModal from '@/components/wrappers/ReSummaryModal/ReSummaryModal';
import { useModalStore } from '@/stores/modalStore';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const meta = {
  title: 'Components/Wrappers/ReSummaryModal',
  component: ReSummaryModal,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ReSummaryModal>;

export default meta;

type Story = StoryObj<typeof ReSummaryModal>;

const StoryWrapper = () => {
  const { type, open } = useModalStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Button label="모달 열기" variant="primary" onClick={() => open('RE_SUMMARY')} />
      {type === 'RE_SUMMARY' && <ReSummaryModal summaryId={123} />}
    </QueryClientProvider>
  );
};

export const Default: Story = {
  render: () => <StoryWrapper />,
};
