import Button from '@/components/basics/Button/Button';
import ReportModal from '@/components/wrappers/ReportModal/ReportModal';
import { useModalStore } from '@/stores/modalStore';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 스토리북에서는 재시도 비활성화
    },
  },
});

const meta = {
  title: 'Components/Wrappers/ReportModal',
  component: ReportModal,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
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
