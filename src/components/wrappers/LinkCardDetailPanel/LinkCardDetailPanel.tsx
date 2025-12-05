'use client';

import Anchor from '@/components/basics/Anchor/Anchor';
import Badge from '@/components/basics/Badge/Badge';
import IconButton from '@/components/basics/IconButton/IconButton';
import TextArea from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import TitleTextArea from '@/components/wrappers/TitleTextArea/TitleTextArea';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

type ActionNodes = React.ReactNode | null;

interface LinkCardDetailPanelProps {
  url: string;
  title: string;
  summary: string;
  memo?: string;
  imageUrl?: string;
  badgeLabel?: string | null;
  headerActions?: ActionNodes;
  titleActions?: ActionNodes;
  summaryActions?: ActionNodes;
  memoActions?: ActionNodes;
  memoEditable?: boolean;
  onClose?: () => void;
  onMore?: () => void;
  onTitleChange?: (value: string) => void;
  onMemoChange?: (value: string) => void;
}

// Link detail side panel: 520px wide, scrollable full height
const LinkCardDetailPanel = ({
  url,
  title,
  summary,
  memo = '',
  imageUrl,
  badgeLabel = null,
  headerActions,
  titleActions,
  summaryActions,
  memoActions,
  memoEditable = true,
  onClose,
  onMore,
  onTitleChange,
  onMemoChange,
}: LinkCardDetailPanelProps) => {
  const safeUrl = getSafeUrl(url);
  const memoAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isMemoEditing, setIsMemoEditing] = useState(false);
  const canEditMemo = memoEditable && Boolean(onMemoChange);

  useEffect(() => {
    if (isMemoEditing && memoAreaRef.current) {
      memoAreaRef.current.focus();
    }
  }, [isMemoEditing]);

  const renderHeaderActions =
    headerActions ??
    (onClose || onMore ? (
      <div className="flex items-center gap-2">
        {onMore && (
          <IconButton
            icon="IC_MoreVert"
            size="sm"
            variant="teritary_subtle"
            contextStyle="onPanel"
            ariaLabel="more actions"
            onClick={onMore}
          />
        )}
        {onClose && (
          <IconButton
            icon="IC_Close"
            size="sm"
            variant="teritary_subtle"
            contextStyle="onPanel"
            ariaLabel="close"
            onClick={onClose}
          />
        )}
      </div>
    ) : null);

  const renderTitleActions =
    titleActions ??
    (onTitleChange ? (
      <div className="flex items-center gap-2">
        <IconButton
          icon="IC_Copy"
          size="sm"
          variant="teritary_subtle"
          contextStyle="onPanel"
          ariaLabel="copy title"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(title);
            }
          }}
        />
      </div>
    ) : null);

  const renderSummaryActions =
    summaryActions ??
    (summary ? (
      <div className="flex items-center gap-2">
        <IconButton
          icon="IC_Copy"
          size="sm"
          variant="teritary_subtle"
          contextStyle="onPanel"
          ariaLabel="copy summary"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(summary);
            }
          }}
        />
        <IconButton
          icon="IC_ThumbUpOutline"
          size="sm"
          variant="teritary_subtle"
          contextStyle="onPanel"
          ariaLabel="like summary"
          onClick={() => console.log('like summary')}
        />
        <IconButton
          icon="IC_ThumbDownOutline"
          size="sm"
          variant="teritary_subtle"
          contextStyle="onPanel"
          ariaLabel="dislike summary"
          onClick={() => console.log('dislike summary')}
        />
      </div>
    ) : null);

  const renderMemoActions =
    memoActions ??
    (memoEditable && onMemoChange ? (
      <div className="flex items-center gap-2">
        <IconButton
          icon="IC_Copy"
          size="sm"
          variant="teritary_subtle"
          contextStyle="onPanel"
          ariaLabel="copy memo"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(memo);
            }
          }}
        />
      </div>
    ) : null);

  return (
    <aside className="bg-gray50 custom-scrollbar h-screen w-[520px] overflow-y-auto">
      <div className="flex h-full flex-col gap-5 pb-6">
        {/* HeaderSection */}
        <header className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="bg-gray900 h-2 w-2 rounded-full" aria-hidden="true" />
            <Anchor href={safeUrl} target="_blank" size="sm" className="text-gray700">
              {safeUrl}
            </Anchor>
          </div>
          {renderHeaderActions}
        </header>

        {/* TitleSection */}
        <section className="flex flex-col gap-2 px-5 pt-5 pb-4">
          {isTitleEditing && onTitleChange ? (
            <Tooltip content="제목 수정하기">
              <TitleTextArea
                value={title}
                onChange={value => {
                  onTitleChange?.(value);
                }}
              />
            </Tooltip>
          ) : (
            <div
              className="rounded-md bg-white p-3 shadow-sm"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (onTitleChange) setIsTitleEditing(true);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onTitleChange) setIsTitleEditing(true);
                }
              }}
            >
              <p className="font-body-md text-gray900 leading-[160%] whitespace-pre-wrap">
                {title}
              </p>
            </div>
          )}
          {renderTitleActions && (
            <div className="flex items-center gap-2">{renderTitleActions}</div>
          )}
        </section>

        {/* ImageSection */}
        <section className="px-5">
          <div className="border-gray100 relative h-[220px] w-full overflow-hidden rounded-xl border bg-white shadow-sm">
            <Image
              src={imageUrl || '/images/default_linkcard_image.png'}
              alt={title || 'link preview image'}
              width={520}
              height={220}
              className="h-full w-full object-cover"
            />
            {badgeLabel && (
              <Badge
                label={badgeLabel}
                icon="IC_Undo"
                variant="neutral"
                className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm"
              />
            )}
          </div>
        </section>

        {/* SummarySection */}
        <section className="flex flex-col gap-2 px-5 pt-5 pb-4">
          <p className="font-body-md text-gray900 leading-[160%] whitespace-pre-wrap">{summary}</p>
          {renderSummaryActions && (
            <div className="flex items-center gap-2">{renderSummaryActions}</div>
          )}
        </section>

        {/* MemoSection */}
        <section className="flex flex-col gap-2 px-5 pt-5 pb-4">
          <Tooltip content="메모 수정하기">
            <TextArea
              ref={memoAreaRef}
              value={memo}
              widthPx={480}
              heightLines={2}
              maxHeightLines={5}
              maxLength={200}
              readOnly={!canEditMemo || !isMemoEditing}
              onClick={() => canEditMemo && setIsMemoEditing(true)}
              onBlur={() => canEditMemo && setIsMemoEditing(false)}
              onChange={e => onMemoChange?.(e.target.value)}
            />
          </Tooltip>
          {renderMemoActions && <div className="flex items-center gap-2">{renderMemoActions}</div>}
        </section>
      </div>
    </aside>
  );
};

export default LinkCardDetailPanel;
