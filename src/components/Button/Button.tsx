"use client";

import { FC, ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 버튼 스타일 종류
     * - primary: 주요 액션
     * - secondary: 보조 액션
     * - danger: 위험·삭제 액션
     */
    variant?: "primary" | "secondary" | "danger";
    /** 버튼 크기 */
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

const VARIANT_CLASSES = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
} as const;

const SIZE_CLASSES = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
} as const;

const Button: FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
}) => {
    const classes = clsx(
        "rounded font-medium transition",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
    );

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
};

export default Button;
