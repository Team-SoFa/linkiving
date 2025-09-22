'use client';

import React from 'react';

interface CardListProps {
  children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  return (
    <div
      className="p-4 rounded-md bg-gray-300 mx-auto gap-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        minWidth: '1080px',
        maxWidth: '1080px',
      }}
    >
      {children}
    </div>
  );
}
