'use client';

import React from 'react';

// LinkCard Width = 48 (192px)

interface CardListProps {
  children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  return <div className="grid w-full max-w-251 grid-cols-4 gap-4">{children}</div>;
}
