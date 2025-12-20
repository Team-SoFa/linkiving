import QueryBox from '@/app/(route)/home/_components/HomeQueryBox/HomeQueryBox';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Wrappers/QueryBox',
  component: QueryBox,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof QueryBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: () => {
      console.log('Submitted!');
    },
  },
};
