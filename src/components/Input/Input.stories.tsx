import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import CustomImage from '../Icons/CustomImage';
import Input from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['outline', 'filled'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

function ControlledInput(args: React.ComponentProps<typeof Input>) {
  const [value, setValue] = useState('');
  return <Input {...args} value={value} onChange={e => setValue(e.target.value)} />;
}

export const Default: Story = {
  render: args => <ControlledInput {...args} />,
  args: {
    placeholder: 'Enter text...',
    size: 'md',
    radius: 'md',
    variant: 'outline',
    icon: <CustomImage src="file.svg" alt="img" />,
    disabled: false,
  },
};
