'use client';

import React from 'react';

// LinkCard Width = 48 (192px)

interface CardListProps {
  children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  // 답변 말풍선 안에 들어가므로 모바일에서는 2열로 두면 카드가 찌그러진다.
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">{children}</div>
  );
}
