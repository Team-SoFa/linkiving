// SearchInput.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import SearchInput from './SearchInput';

const meta: Meta<typeof SearchInput> = {
    title: 'Components/SearchInput',
    component: SearchInput,
    tags: ['autodocs'],
    argTypes: {
        size: {
        control: { type: 'select' },
        options: ['md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState('');

        return (
        <SearchInput
            {...args}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSubmit={(e) => {
            e.preventDefault();
            console.log('Submit:', value);
            }}
        />
        );
    },
    args: {
        placeholder: '검색하세요',
        size: 'md',
    },
};
