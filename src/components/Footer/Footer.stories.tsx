// Footer.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Footer from "./Footer";

const meta: Meta<typeof Footer> = {
    title: "Components/Footer",
    component: Footer,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
