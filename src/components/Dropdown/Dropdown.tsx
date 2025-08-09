"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { DropdownMenu } from "./DropdownMenu";
import { useDropdown } from "./usdDropdown";

export interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    defaultSelected?: DropdownOption;
    onSelect: (option: DropdownOption) => void;
    size?: "sm" | "md" | "lg";
    color?: "red" | "blue" | "white";
}



export default function Dropdown({
    options,
    defaultSelected = options[0],
    onSelect,
    size = "sm",
    color = "white",
}: DropdownProps) {
    const { isOpen, toggle, close, dropdownRef } = useDropdown();
    const [selected, setSelected] = useState<DropdownOption>(defaultSelected);

    const baseStyle = "relative inline-block"
    const buttonStyle = "px-4 py-2 text-gray-900 max-w-60 rounded-md transition-colors hover:cursor-pointer"
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg"
    }
    const colors = {
        red: "bg-red-200 hover:bg-red-300",
        blue: "bg-blue-200 hover:bg-blue-300",
        white: "bg-white hover:bg-gray-300"
    }
    const buttonClasses = clsx(
        buttonStyle,
        sizes[size],
        colors[color]
    )

    const handleSelect = (option: DropdownOption) => {
        setSelected(option);
        onSelect?.(option);
        close();
    };

    return (
        <div
            className={baseStyle}
            ref={dropdownRef}
        >
            <button
                onClick={toggle}
                className={buttonClasses}
            >
                {selected.label}
                {isOpen ? " ▲" : " ▼"}
            </button>
            {isOpen && (
                <DropdownMenu
                    options={options}
                    onSelect={handleSelect}
                    close={close}
                    size={size}
                />
            )}
        </div>
    );
}