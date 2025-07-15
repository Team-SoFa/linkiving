import type { Meta, StoryObj } from "@storybook/react";
import IconButton from "./IconButton";

const meta: Meta<typeof IconButton> = {
    title: "Components/IconButton",
    component: IconButton,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: { type: "radio" },
            options: ["solid", "outline"],
        },
        size: {
            control: { type: "radio" },
            options: ["sm", "md", "lg"],
        },
        radius: {
            control: { type: "radio" },
            options: ["none", "sm", "md", "lg", "full"],
        },
        onClick: { action: "clicked" },
        ariaLabel: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
    args: {
        variant: "solid",
        size: "md",
        radius: "md",
        icon: <img src="/next.svg" className="w-5 h-5" />,
        ariaLabel: "Icon Button",
    },
};
