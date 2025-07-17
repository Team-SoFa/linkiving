import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import CustomImage from '../Icons/CustomImage';
import TextField from './InputText';

const meta = {
  title: 'Components/TextField',
  component: TextField,
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
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof TextField>;

function ControlledTextField(
  args: typeof TextField extends React.ComponentType<infer P> ? P : never
) {
  const [value, setValue] = useState('');
  return <TextField {...args} value={value} onChange={e => setValue(e.target.value)} />;
}

export const Default: Story = {
  render: args => <ControlledTextField {...args} />,
  args: {
    placeholder: 'Enter text...',
    size: 'md',
    radius: 'md',
    variant: 'outline',
    icon: <CustomImage src="file.svg" alt="img" />,
    disabled: false,
  },
};
