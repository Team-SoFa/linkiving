"use client";

import React from "react";

export default function Footer() {
    const baseStyle = "text-center text-sm text-gray-500 dark:text-gray-400";
    return (
        <footer className={baseStyle}>
            <p>
                &copy; {new Date().getFullYear()} Linkiving. All rights reserved.
            </p>
        </footer>
    );
}