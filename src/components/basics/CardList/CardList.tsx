'use client';

import React from 'react';

interface CardListProps {
  children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  return (
    <div className="flex w-132 flex-wrap justify-start gap-4 rounded-md bg-gray-300 p-4 md:w-196 lg:w-260">
      {children}
    </div>
  );
}
