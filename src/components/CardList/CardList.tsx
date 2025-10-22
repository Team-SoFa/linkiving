'use client';

import React from 'react';

interface CardListProps {
  children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  return (
    <div className="flex flex-wrap w-132 md:w-196 lg:w-260 gap-4 justify-start bg-gray-300 p-4 rounded-md">
      {children}
    </div>
  );
}
