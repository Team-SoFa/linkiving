import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button/Button";

const meta: Meta<typeof Button> = {
    title: "Components/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: { type: "radio" },
            options: ["primary", "secondary", "danger"],
        },
        size: {
            control: { type: "radio" },
            options: ["sm", "md", "lg"],
        },
        onClick: { action: "clicked" },
        className: { table: { disable: true } },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: "primary",
        size: "md",
        children: "Primary Button",
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        size: "md",
        children: "Secondary Button",
    },
};

export const LargeDanger: Story = {
    args: {
        variant: "danger",
        size: "lg",
        children: "Danger Button",
    },
};
