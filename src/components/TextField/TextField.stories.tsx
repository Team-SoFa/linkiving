import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import TextField from './TextField';

const meta: Meta<typeof TextField> = {
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
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState('');

        return (
            <TextField
                {...args}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        );
    },
    args: {
        placeholder: 'Enter text...',
        size: 'md',
        radius: 'md',
        variant: 'outline',
        icon: <img src="/window.svg" className="w-5 h-5" />,
        disabled: false,
    },
};