'use client';

import React from 'react';

import CustomImage from '../Icons/CustomImage';

interface BookmarkCardProps {
  title: string;
  imageUrl?: string;
  summary: string;
  link: string;
  onClick?: () => void;
}
export default function BookmarkCard({
  title = '',
  imageUrl = '',
  summary = '',
  link = '',
  onClick,
}: BookmarkCardProps) {
  const baseStyle = 'flex flex-col w-60 h-60 rounded-lg overflow-hidden hover:cursor-pointer';
  const imageAreaStyle =
    'flex flex-shrink-0 justify-center items-center  bg-gray-400 w-full h-[50%]';
  const infoAreaStyle = 'flex flex-col gap-1 px-4 py-3 bg-gray-200 w-full h-[50%]';

  const titleStyle = 'text-lg font-semibold text-gray-800 truncate';
  const linkStyle = 'block w-full text-[12px] text-blue-500 hover:underline';
  const summaryStyle = 'text-[12px] text-gray-600 font-normal truncate'; // 추후 line-clamp-2 or line-clamp-3 custom style 추가 필요

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onClick) return;
    // 인터랙티브 자식에서 발생한 키 입력 무시
    const target = e.target as HTMLElement | null;
    if (target && target.closest('a,button,[role="button"],input,textarea,select')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    // 카드로 이벤트 전달되는 것 방지
    e.stopPropagation();
  };
  const safeHref = /^https?:\/\//i.test(link) ? link : undefined;

  return (
    <div
      className={`${baseStyle} ${onClick ? 'hover:cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className={imageAreaStyle}>
        <CustomImage
          src={imageUrl ?? 'file.svg'}
          alt="image"
          width={240}
          height={120}
          // className="object-cover w-full h-full"
        />
      </div>
      <div className={infoAreaStyle}>
        <span className={titleStyle}>{title}</span>
        {safeHref ? (
          <a
            className={`${linkStyle} truncate`}
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            title={link}
            aria-label={`${title} 페이지 링크 열기`}
          >
            {link}
          </a>
        ) : (
          <span className={`${linkStyle} text-gray-500`} title={link}>
            {link}
          </span>
        )}
        <span className={summaryStyle}>{summary}</span>
      </div>
    </div>
  );
}
