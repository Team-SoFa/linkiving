'use client';

import React from 'react';

// LinkCard Width = 48 (192px)

interface CardListProps {
  children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  return (
    <div className="flex w-149 flex-wrap justify-start gap-4 md:w-200 lg:w-251">{children}</div>
  );
}
