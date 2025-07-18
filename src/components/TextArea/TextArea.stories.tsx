// TextArea.stories.tsx

import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import TextArea from "./TextArea";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof TextArea> = {
    title: "Components/TextArea",
    component: TextArea,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TextArea>;

/**
 * - Enter: 입력 완료(onSubmit 호출)
 * - Shift+Enter: 줄바꿈
 */
export const Default: Story = {
    render: () => {
        const [text, setText] = useState("");

        return (
        <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onSubmit={action("Submitted")}
            placeholder="무엇이든 물어보세요"
        />
        );
    },
};
