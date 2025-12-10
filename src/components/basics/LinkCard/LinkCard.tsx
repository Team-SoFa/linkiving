'use client';

import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import { useInteractiveKeyBlock } from '@/hooks/util/useInteractiveKeyBlock';
import Image from 'next/image';
import React from 'react';

import Anchor from '../Anchor/Anchor';
import Badge from '../Badge/Badge';

const SUMMARY_FAIL_TEXT = '요약 생성에 실패했습니다. 상세 패널에서 다시 시도해보세요.';

interface LinkCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  imageUrl: string;
  link: string;
  summary: string;
  title: string;
  onClick?: () => void;
}
const LinkCard = React.forwardRef<HTMLDivElement, LinkCardProps>(function LinkCard(
  { imageUrl, link, summary, title, onClick, ...rest },
  ref
) {
  const handleKeyDown = useInteractiveKeyBlock({ onClick });
  const safeHref = getSafeUrl(link);

  return (
    <div
      ref={ref}
      className="border-gray200 hover:bg-gray50 active:bg-blue50 focus:border-blue500 relative flex h-58 w-47 cursor-pointer flex-col overflow-hidden rounded-2xl border transition-colors"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {!summary && (
        <Badge
          label="요약 실패"
          icon="IC_Warning"
          variant="warning"
          className="absolute top-2 left-2 z-10"
        />
      )}

      <div className="bg-gray900 relative h-22 w-full shrink-0">
        <Image
          src={imageUrl ? imageUrl : '/images/default_linkcard_image.png'}
          alt={title}
          fill
          className="border-gray200 border-b object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="flex flex-col gap-1">
          <span className="truncate text-sm font-semibold">{title}</span>
          <div className="flex items-center gap-1">
            <Anchor
              href={safeHref}
              aria-label={`${title} 페이지 링크 열기`}
              className="[&>span]:max-w-35"
            >
              {link}
            </Anchor>
          </div>
        </div>
        {!!summary ? (
          <span className="text-etc-linkcard-summary font-body-sm line-clamp-2">{summary}</span>
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
