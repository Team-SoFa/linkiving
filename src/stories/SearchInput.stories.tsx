// SearchInput.stories.tsx
import SearchInput from '@/components/wrappers/SearchInput/SearchInput';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['md', 'lg'],
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof SearchInput>;

function ControlledSearchInput(
  args: typeof SearchInput extends React.ComponentType<infer P> ? P : never
) {
  const [value, setValue] = useState('');

  return (
    <SearchInput
      {...args}
      value={value}
      onChange={e => setValue(e.target.value)}
      onSubmit={e => {
        e.preventDefault();
        console.log('Submit:', value);
      }}
    />
  );
}

export const Default: Story = {
  render: args => <ControlledSearchInput {...args} />,
  args: {
    placeholder: '검색하세요',
    size: 'md',
  },
};
