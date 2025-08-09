"use client";

import React from "react";
import clsx from "clsx";

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    placeholder?: string;
    size?: "md" | "lg";
}

export default function SearchInput({
    value,
    onChange,
    onSubmit,
    placeholder = "검색하세요",
    size = "md",
}: SearchInputProps) {
    const baseStyle = "flex justify-between px-4 h-10 text-gray-800 bg-white placeholder-gray-400 rounded-full";
    const sizes = {
        md: "w-70",
        lg: "w-full",
    };

    const classes = clsx(
        baseStyle,
        sizes[size],
    );
    return (
        <form onSubmit={onSubmit} className={classes}>
            <div className="flex">
                <img className="mr-2 shrink-0 w-5" src="/globe.svg" alt="logo"/>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none"
                />
            </div>
            <button className="shrink-0 w-5 hover:cursor-pointer">🔍</button>
            {/* 추후 IconButton으로 변경 */}
        </form>
    )
};