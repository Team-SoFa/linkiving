import UserChatBox, { UserChatBoxProps } from '@/components/wrappers/UserChatBox/UserChatBox';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta = {
  title: 'Components/Wrappers/UserChatBox',
  component: UserChatBox,
  tags: ['autodocs'],
  argTypes: {
    onChange: {
      action: '입력값 변경',
    },
  },
} satisfies Meta<typeof UserChatBox>;

export default meta;
type Story = StoryObj<typeof UserChatBox>;

function InteractiveTextArea(props: UserChatBoxProps) {
  const [text, setText] = useState('');

  return (
    <UserChatBox value={text} onChange={e => setText(e.target.value)} onSubmit={props.onSubmit} />
  );
}

export const Default: Story = {
  render: args => <InteractiveTextArea {...args} />,
  args: {},
};
