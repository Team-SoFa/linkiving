"use client";

import React from 'react';
import {clsx} from 'clsx';

interface LabelProps {
    text: string;
    htmlFor?: string;
    size?: 'sm' | 'md' | 'lg';
    required?: boolean;
}

export default function Label({
    text,
    htmlFor,
    size = 'md',
    required = false,
    }: LabelProps) {
        const baseStyle = "block text-gray-800 font-semibold";
        const sizes = {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        };
        const classes = clsx(
            baseStyle,
            sizes[size],
            required && "after:content-['*'] after:text-red-500 after:ml-1"
        )
        
        return (
            <label
                htmlFor = {htmlFor}
                className = {classes}
            >
                {text}
            </label>
        )
}