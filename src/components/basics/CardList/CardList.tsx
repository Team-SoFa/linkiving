'use client';

import React from 'react';

// LinkCard Width = 48 (192px)

interface CardListProps {
  children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{children}</div>;
}
