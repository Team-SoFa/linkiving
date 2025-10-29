'use client';

import Button from '@/components/Button/Button';
import Image from 'next/image';
import React from 'react';
import { tv } from 'tailwind-variants';

import SVGIcon from '../Icons/SVGIcon';

const cardStyles = tv({
  base: `flex h-55 w-47 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 hover:cursor-pointer hover:border-blue-100 hover:bg-blue-50 focus:border-blue-200 focus:bg-blue-50`,
});

interface BookmarkCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  imageUrl?: string;
  isHaveSummary?: boolean;
  link: string;
  summary: string;
  title: string;
  onClick?: () => void;
}
const BookmarkCard = React.forwardRef<HTMLDivElement, BookmarkCardProps>(
  ({ imageUrl = '', isHaveSummary, link = '', summary = '', title = '', onClick }, ref) => {
    // 인터랙티브 자식에서 발생한 키 입력 무시
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!onClick) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a,button,[role="button"],input,textarea,select')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    // 카드로 이벤트 전달되는 것 방지
    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    // 안전성 체크
    const safeHref = /^https?:\/\//i.test(link) ? link : undefined;

    return (
      <div
        ref={ref}
        className={cardStyles()}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <div className="flex h-22 w-full flex-shrink-0 bg-gray-900">
          <Image
            src={imageUrl ?? 'file.svg'}
            alt="Url thumbnail"
            width={240}
            height={120}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex h-full w-full flex-col justify-between gap-1 p-3">
          <div className="flex flex-col gap-1">
            <span className="truncate text-sm font-semibold text-gray-900">{title}</span>
            <div className="flex items-center gap-1">
              <div>
                <SVGIcon icon="IC_LinkOpen" size="sm" className="text-gray-400" />
              </div>
              {safeHref ? (
                <a
                  className="block truncate text-xs text-gray-400 hover:underline"
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
                <span className="block truncate text-sm text-gray-400" title={link}>
                  {link}
                </span>
              )}
            </div>
          </div>
          {isHaveSummary && (
            <span className="truncate text-xs font-normal text-gray-700">{summary}</span>
          )}
          {!isHaveSummary && (
            <div className="flex justify-end">
              <Button
                icon="IC_SumGenerate"
                label="요약 생성"
                variant="primary"
                size="sm"
                className="w-[93px]"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default BookmarkCard;
