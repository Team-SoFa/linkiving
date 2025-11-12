import SVGIcon from '@/components/Icons/SVGIcon';
import Input from '@/components/Input/Input';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
    },
    radius: {
      control: { type: 'select' },
    },
    variant: {
      control: { type: 'select' },
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
    icon: <SVGIcon icon="IC_AllLink" />,
    disabled: false,
  },
};
