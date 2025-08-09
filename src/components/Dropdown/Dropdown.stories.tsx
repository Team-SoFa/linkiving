import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Dropdown, { DropdownOption } from "./Dropdown";

const options: DropdownOption[] = [
    { value: "apple", label: "🍎 Apple" },
    { value: "banana", label: "🍌 Banaaaana" },
    { value: "cherry", label: "🍒 Cherry" },
    { value: "grape", label: "🍇 Grape" },
    { value: "watermelon", label: "🍉 Watermelon" },
    { value: "peach", label: "🍑 Peach" },
];

const meta: Meta<typeof Dropdown> = {
    title: "Components/Dropdown",
    component: Dropdown,
    tags: ["autodocs"],
    argTypes: {
        onSelect: {
            action: "option selected",
            description: "선택된 옵션을 처리하는 콜백 함수",
        },
        size: {
            control: { type: "select" },
            options: ["sm", "md", "lg"],
        },
        color: {
            control: { type: "select" },
            options: ["red", "blue", "white"],
        },
    },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

// 인터랙티브 스토리 (render 있음)
export const Default: Story = {
    render: (args) => {
        const [selected, setSelected] = useState<DropdownOption>(args.defaultSelected ?? options[0]);
        return (
            <Dropdown
                {...args}
                defaultSelected={selected}
                onSelect={(option) => {
                    setSelected(option);
                    args.onSelect?.(option);
                }}
            />
        );
    },
    args: {
        options,
        defaultSelected: options[0],
        size: "sm",
        color: "blue",
    },
};
