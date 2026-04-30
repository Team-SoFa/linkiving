'use client';

import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import MarkdownRenderer from '@/hooks/util/parseMarkdown';
import { useInteractiveKeyBlock } from '@/hooks/util/useInteractiveKeyBlock';
import type { LinkSummaryStatus } from '@/types/link';
import Image from 'next/image';
import React, { memo } from 'react';

import Anchor from '../Anchor/Anchor';
import Badge from '../Badge/Badge';
import IconButton from '../IconButton/IconButton';

const SUMMARY_FAIL_TEXT = '요약 생성에 실패했습니다. 상세 패널에서 다시 시도해보세요.';

interface LinkCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onSelect'> {
  imageUrl: string;
  link: string;
  summary: string;
  title: string;
  summaryStatus?: LinkSummaryStatus;
  summaryErrorMessage?: string;
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
    summaryStatus = 'idle',
    summaryErrorMessage,
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

  const normalizedSummary = summary?.trim();
  const isSummaryEmpty =
    !normalizedSummary ||
    normalizedSummary.toLowerCase() === 'null' ||
    normalizedSummary.toLowerCase() === 'undefined';

  const normalizedImageUrl =
    imageUrl &&
    imageUrl.trim() &&
    imageUrl.trim().toLowerCase() !== 'null' &&
    imageUrl.trim().toLowerCase() !== 'undefined'
      ? imageUrl
      : '';
  const safeImageUrl = getSafeUrl(normalizedImageUrl) || '/images/default_linkcard_image.png';
  const showUnknownSummarySkeleton = summaryStatus === 'idle' && isSummaryEmpty;

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

      {(summaryStatus === 'generating' || summaryStatus === 'failed') && (
        <Badge
          label={summaryStatus === 'generating' ? '요약 생성 중' : '요약 실패'}
          icon={summaryStatus === 'generating' ? 'IC_SumGenerate' : 'IC_Warning'}
          variant={summaryStatus === 'generating' ? 'primary' : 'warning'}
          className="absolute top-2 left-2 z-10"
        />
      )}

      <div className="bg-gray900 relative aspect-94/47 w-full max-w-94 shrink-0">
        <Image
          src={safeImageUrl}
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
              target="_blank"
            >
              {link}
            </Anchor>
          </div>
        </div>
        {(() => {
          if (summaryStatus === 'generating') {
            return (
              <div className="mt-8.75 flex flex-col gap-2">
                <div className="bg-gray200 h-4 w-full rounded" />
                <div className="bg-gray200 h-4 w-3/4 rounded" />
              </div>
            );
          }

          if (showUnknownSummarySkeleton) {
            return (
              <div className="flex flex-col gap-2">
                <div className="bg-gray200 h-4 w-full rounded" />
                <div className="bg-gray200 h-4 w-3/4 rounded" />
              </div>
            );
          }

          if (summaryStatus === 'failed') {
            return (
              <div className="font-body-sm text-etc-linkcard-summary flex justify-end">
                <span>{summaryErrorMessage ?? SUMMARY_FAIL_TEXT}</span>
              </div>
            );
          }

          if (summaryStatus === 'ready') {
            return !isSummaryEmpty ? (
              <MarkdownRenderer
                className="text-etc-linkcard-summary font-body-sm line-clamp-2"
                content={summary}
              />
            ) : (
              <div className="font-body-sm text-etc-linkcard-summary text-gray600">
                <span>요약이 곧 도착합니다...</span>
              </div>
            );
          }

          if (!isSummaryEmpty) {
            return (
              <MarkdownRenderer
                className="text-etc-linkcard-summary font-body-sm line-clamp-2"
                content={summary}
              />
            );
          }

          return (
            <div className="font-body-sm text-etc-linkcard-summary text-gray600 flex justify-end">
              <span>요약이 아직 생성되지 않았습니다.</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
});

export default memo(LinkCard);
