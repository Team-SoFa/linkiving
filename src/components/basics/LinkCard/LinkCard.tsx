'use client';

import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import MarkdownRenderer from '@/hooks/util/parseMarkdown';
import { useInteractiveKeyBlock } from '@/hooks/util/useInteractiveKeyBlock';
import Image from 'next/image';
import React from 'react';

import Anchor from '../Anchor/Anchor';
import Badge from '../Badge/Badge';
import IconButton from '../IconButton/IconButton';

const SUMMARY_FAIL_TEXT = '요약 생성에 실패했습니다. 상세 패널에서 다시 시도해보세요.';

interface LinkCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onSelect'> {
  imageUrl: string;
  link: string;
  summary: string;
  title: string;
  isSelected?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  onSelect?: (e: React.MouseEvent) => void;
}

const LinkCard = React.forwardRef<HTMLDivElement, LinkCardProps>(function LinkCard(
  {
    imageUrl,
    link,
    summary,
    title,
    onClick,
    isSelected = false,
    onSelect,
    selectable = false,
    ...rest
  },
  ref
) {
  const handleKeyDown = useInteractiveKeyBlock({ onClick });
  const safeHref = getSafeUrl(link);

  return (
    <div
      ref={ref}
      className="border-gray200 hover:bg-gray50 active:bg-blue50 focus:border-blue500 group relative flex aspect-47/58 w-full min-w-35 cursor-pointer flex-col overflow-hidden rounded-2xl border transition-colors"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* 호버/선택 오버레이 */}
      {selectable && (
        <div
          className={`pointer-events-none absolute inset-0 z-10 rounded-2xl transition-colors ${
            isSelected ? 'bg-blue500/20' : 'bg-transparent group-hover:bg-black/20'
          }`}
        />
      )}

      {/* 체크 버튼 */}
      {selectable && (
        <div
          className={`absolute top-2 right-2 z-20 transition-opacity ${
            isSelected
              ? 'opacity-100'
              : 'pointer-events-none opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100'
          }`}
        >
          <IconButton
            icon="IC_Check"
            size="sm"
            variant={isSelected ? 'primary' : 'secondary'}
            ariaLabel={isSelected ? '링크 선택 해제' : '링크 선택'}
            aria-pressed={isSelected}
            onClick={e => {
              e.stopPropagation();
              onSelect?.(e);
            }}
          />
        </div>
      )}

      {!summary && (
        <Badge
          label="요약 실패"
          icon="IC_Warning"
          variant="warning"
          className="absolute top-2 left-2 z-10"
        />
      )}

      <div className="bg-gray900 relative aspect-94/47 w-full max-w-94 shrink-0">
        <Image
          src={imageUrl ? imageUrl : '/images/default_linkcard_image.png'}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="border-gray200 border-b object-cover"
        />
      </div>
      <div className="flex w-full flex-1 flex-col justify-between p-3">
        <div className="flex flex-col gap-1">
          <span className="truncate text-sm font-semibold">{title}</span>
          <div className="flex items-center gap-1">
            <Anchor
              href={safeHref}
              aria-label={`${title} 페이지 링크 열기`}
              className="min-w-0 [&>span]:max-w-full [&>span]:truncate"
            >
              {link}
            </Anchor>
          </div>
        </div>
        {!!summary ? (
          <MarkdownRenderer
            className="text-etc-linkcard-summary font-body-sm line-clamp-2"
            content={summary}
          />
        ) : (
          <div className="font-body-sm text-etc-linkcard-summary flex justify-end">
            <span>{SUMMARY_FAIL_TEXT}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default LinkCard;
