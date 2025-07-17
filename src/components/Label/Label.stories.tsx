import type { Meta, StoryObj } from '@storybook/react';
import Label from './Label';

const meta: Meta<typeof Label> = {
    title: 'Components/Label',
    component: Label,
    tags: ['autodocs'],
    argTypes: {
        text: {
            control: 'text',
            defaultValue: 'Label',
        },
        htmlFor: {
            control: 'text',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        required: {
            control: 'boolean',
            options: [true, false],
            defaultValue: false,
        },
    },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    args: {
        text: 'Label',
        htmlFor: 'input-id',
        size: 'md',
        required: false,
    },
};