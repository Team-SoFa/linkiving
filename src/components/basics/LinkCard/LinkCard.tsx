'use client';

import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import { useInteractiveKeyBlock } from '@/hooks/util/useInteractiveKeyBlock';
import Image from 'next/image';
import React from 'react';

import Anchor from '../Anchor/Anchor';
import { cardStyle } from './LinkCard.style';
import AddSummaryButton from './components/AddSummaryButton';

interface LinkCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  imageUrl: string;
  isHaveSummary?: boolean;
  link: string;
  summary: string;
  title: string;
  onClick?: () => void;
}
const LinkCard = React.forwardRef<HTMLDivElement, LinkCardProps>(function LinkCard(
  { imageUrl, isHaveSummary = false, link, summary, title, onClick, ...rest },
  ref
) {
  const handleKeyDown = useInteractiveKeyBlock({ onClick });
  const safeHref = getSafeUrl(link);

  return (
    <div
      ref={ref}
      className={cardStyle()}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div className="bg-gray900 flex h-22 w-full shrink-0">
        <Image
          src={imageUrl ? imageUrl : '/images/default_linkcard_image.png'}
          alt={title}
          width={240}
          height={120}
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-col justify-between p-3">
        <div className="flex flex-col gap-1">
          <span className="text-gray900 truncate text-sm font-semibold">{title}</span>
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
        {isHaveSummary ? (
          <span className="text-etc-linkcard-summary line-clamp-2 text-xs font-normal">
            {summary}
          </span>
        ) : (
          <div className="flex justify-end">
            <AddSummaryButton />
          </div>
        )}
      </div>
    </div>
  );
});

export default LinkCard;
