"use client";

import React from "react";

interface CardListProps {
    children : React.ReactNode;
};

export default function CardList({
    children,
}: CardListProps) {
    const baseStyle = "p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-md bg-gray-300";

    return (
        <div className={baseStyle}>
            {children}
        </div>
    );
}