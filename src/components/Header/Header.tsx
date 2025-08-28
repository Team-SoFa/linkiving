'use client';

import React from 'react';

import Button from '../Button/Button';

export default function Header() {
  const headerStyle = 'bg-blue-200 p-4 flex justify-between w-full';
  const setStyle = 'gap-2 flex items-center';

  return (
    <header className={headerStyle}>
      <Button>BTN</Button>
      <div className={setStyle}>
        <Button>더보기</Button>
        <Button>로그인</Button>
      </div>
    </header>
  );
}
