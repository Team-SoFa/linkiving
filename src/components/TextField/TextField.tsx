"use client";

import React from "react";
import clsx from "clsx";

interface TextFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    size?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg";
    variant?: "outline" | "filled";
    icon?: "string" | React.ReactNode;
    disabled?: boolean;
}

export default function TextField({
    value,
    onChange,
    placeholder = "Enter text...",
    size = "md",
    radius = "md",
    variant = "outline",
    icon,
    disabled = false,
}: TextFieldProps) {
    const baseStyle = "h-10 text-gray-800 placeholder-gray-400";
    const sizes = {
        sm: "w-32",
        md: "w-60",
        lg: "w-full",
    };
    const radiuses = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-full",
    };
    const variants = {
        outline: "border border-gray-300 bg-white focus-within:border-gray-600",
        filled: "bg-blue-200 focus-within:bg-blue-300",
    }
    const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

    const classes = clsx(
        baseStyle,
        sizes[size],
        radiuses[radius],
        variants[variant],
        disabledStyle,
        "flex items-center px-4"
    );
    return (
        <div className={classes}>
            {icon && <span className="mr-2 shrink-0">{icon}</span>}
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 bg-transparent outline-none"
            />
        </div>
    )
};