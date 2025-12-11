'use client';

import SVGIcon from '@/components/Icons/SVGIcon';
import AccordionButton from '@/components/basics/Accordion/AccordionButton/AccordionButton';
import Anchor from '@/components/basics/Anchor/Anchor';
import Button from '@/components/basics/Button/Button';
import Divider from '@/components/basics/Divider/Divider';
import IconButton from '@/components/basics/IconButton/IconButton';
import Label from '@/components/basics/Label/Label';
import TextArea from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import { styles } from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel.style';
import TitleTextArea from '@/components/wrappers/LinkCardDetailPanel/TitleTextArea';
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

const LinkCardDetailPanel = ({
  url,
  title,
  summary,
  memo = '',
  imageUrl,
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
  const TITLE_MAX_LENGTH = 100;
  const MEMO_MAX_LENGTH = 200;
  const safeUrl = getSafeUrl(url);
  const memoAreaRef = useRef<HTMLTextAreaElement>(null);
  const titleAreaRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const [internalTitle, setInternalTitle] = useState(title);
  const [internalMemo, setInternalMemo] = useState(memo);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isMemoEditing, setIsMemoEditing] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isSummaryOverflowing, setIsSummaryOverflowing] = useState(false);
  const {
    root,
    content,
    header,
    headerLeft,
    headerBadge,
    divider,
    section,
    titleCard,
    actionRow,
    linkActions,
    imageWrapper,
    summaryWrapper,
    memoWrapper,
  } = styles();
  const canEditMemo = memoEditable;

  useEffect(() => {
    setInternalTitle(title);
  }, [title]);

  useEffect(() => {
    setInternalMemo(memo);
  }, [memo]);

  useEffect(() => {
    setIsSummaryExpanded(false);
  }, [summary]);

  useEffect(() => {
    const element = summaryRef.current;
    if (!element) return undefined;

    const measureOverflow = () => {
      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight || '0');
      if (!lineHeight) {
        setIsSummaryOverflowing(false);
        return;
      }

      const wasClamped = element.classList.contains('line-clamp-5');
      if (wasClamped) {
        element.classList.remove('line-clamp-5');
      }

      const fullHeight = element.scrollHeight;
      if (wasClamped) {
        element.classList.add('line-clamp-5');
      }

      const maxHeight = lineHeight * 5;
      setIsSummaryOverflowing(fullHeight > maxHeight + 1);
    };

    measureOverflow();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => measureOverflow());
      resizeObserver.observe(element);
      return () => resizeObserver.disconnect();
    }

    return undefined;
  }, [summary]);

  useEffect(() => {
    if (isMemoEditing && memoAreaRef.current) {
      memoAreaRef.current.focus();
    }
  }, [isMemoEditing]);

  useEffect(() => {
    if (isTitleEditing && titleAreaRef.current) {
      titleAreaRef.current.focus();
    }
  }, [isTitleEditing]);

  const renderHeaderActions =
    headerActions !== undefined ? (
      headerActions
    ) : onClose || onMore ? (
      <div className="flex items-center gap-2">
        {onMore && (
          <IconButton
            icon="IC_MoreVert"
            size="sm"
            variant="tertiary_subtle"
            contextStyle="onPanel"
            ariaLabel="more actions"
            onClick={onMore}
          />
        )}
        {onClose && (
          <IconButton
            icon="IC_Close"
            size="sm"
            variant="tertiary_subtle"
            contextStyle="onPanel"
            ariaLabel="close"
            onClick={onClose}
          />
        )}
      </div>
    ) : null;

  const renderTitleActions =
    titleActions !== undefined ? (
      titleActions
    ) : onTitleChange ? (
      <div className="flex items-center gap-2">
        <IconButton
          icon="IC_Copy"
          size="sm"
          variant="tertiary_subtle"
          contextStyle="onPanel"
          ariaLabel="copy title"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(internalTitle);
            }
          }}
        />
      </div>
    ) : null;

  const renderSummaryActions =
    summaryActions !== undefined ? (
      summaryActions
    ) : summary ? (
      <div className="flex items-center justify-start gap-2 pt-2">
        <Button
          size="sm"
          variant="tertiary_subtle"
          contextStyle="onPanel"
          icon="IC_SumGenerate"
          label="요약 재생성"
          onClick={() => console.log('요약 재생성')}
        />
        <IconButton
          size="sm"
          variant="tertiary_subtle"
          contextStyle="onPanel"
          icon="IC_Copy"
          ariaLabel="copy summary"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(summary);
            }
          }}
        />
      </div>
    ) : null;

  const renderMemoActions = memoActions ?? null;

  return (
    <aside className={root()}>
      <div className={content()}>
        {/* HeaderSection */}
        <header className={header()}>
          <div className={headerLeft()}>
            <span className={headerBadge()}>
              <SVGIcon icon="IC_Warning" size="xs" className="text-white" aria-hidden="true" />
            </span>{' '}
            {safeUrl ? (
              <Anchor href={safeUrl} target="_blank" size="sm" className="text-gray700">
                {safeUrl}
              </Anchor>
            ) : (
              <span className="text-gray500 font-body-sm">유효하지 않은 URL</span>
            )}
          </div>
          {renderHeaderActions}
        </header>
        <Divider color="gray200" className={divider()} />
        {/* TitleSection */}
        <section className={section()}>
          {isTitleEditing ? (
            <div
              onBlur={e => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsTitleEditing(false);
                }
              }}
            >
              <Tooltip content="제목 수정하기">
                <div className="w-[480px]">
                  <TitleTextArea
                    ref={titleAreaRef}
                    value={internalTitle}
                    placeholder="텍스트박스를 클릭해 제목을 수정하세요."
                    maxLength={TITLE_MAX_LENGTH}
                    onSubmit={() => setIsTitleEditing(false)}
                    onChange={e => {
                      const value = e.target.value;
                      if (onTitleChange) {
                        onTitleChange(value);
                      } else {
                        setInternalTitle(value);
                      }
                    }}
                  />
                </div>
              </Tooltip>
            </div>
          ) : (
            <Tooltip content="제목 수정하기">
              <div
                className={titleCard()}
                role="button"
                tabIndex={0}
                style={{ maxWidth: 480 }}
                onClick={() => {
                  setIsTitleEditing(true);
                }}
                onFocus={() => {
                  setIsTitleEditing(true);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsTitleEditing(true);
                  }
                }}
              >
                <p className="font-body-md text-gray900 leading-[160%] whitespace-pre-wrap">
                  {internalTitle}
                </p>
              </div>
            </Tooltip>
          )}
          {renderTitleActions && <div className={actionRow()}>{renderTitleActions}</div>}
          <div className={linkActions()}>
            <Button
              size="sm"
              variant="tertiary_subtle"
              contextStyle="onPanel"
              icon="IC_LinkOpen"
              label="링크 방문"
              onClick={() => {
                if (safeUrl) window.open(safeUrl, '_blank', 'noopener,noreferrer');
              }}
            />
            <IconButton
              size="sm"
              variant="tertiary_subtle"
              contextStyle="onPanel"
              icon="IC_Copy"
              ariaLabel="copy link"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                  navigator.clipboard.writeText(safeUrl);
                }
              }}
            />
          </div>
        </section>

        {/* ImageSection */}
        <section className="px-0">
          <div className={imageWrapper()}>
            <Image
              src={imageUrl || '/images/default_linkcard_image.png'}
              alt={title || 'link preview image'}
              width={520}
              height={220}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* SummarySection */}
        <section className={section()}>
          <Label textSize="sm" className="text-gray900">
            요약
          </Label>
          <div className={summaryWrapper()}>
            <p
              ref={summaryRef}
              className={`font-body-md text-gray900 max-w-[480px] leading-[160%] whitespace-pre-wrap ${
                isSummaryExpanded ? '' : 'line-clamp-5'
              }`}
            >
              {summary}
            </p>
            {isSummaryOverflowing && (
              <AccordionButton
                isOpen={isSummaryExpanded}
                setIsOpen={setIsSummaryExpanded}
                openTitle="간략히"
                closeTitle="자세히"
              />
            )}
          </div>
          {renderSummaryActions}
        </section>
        <Divider color="gray200" className={divider()} />

        {/* MemoSection */}
        <section className={section()}>
          <Label textSize="sm" className="text-gray900">
            메모
          </Label>
          <Tooltip content="메모 수정하기">
            <div className={memoWrapper()}>
              <TextArea
                ref={memoAreaRef}
                value={internalMemo}
                heightLines={2}
                maxHeightLines={6}
                maxLength={isMemoEditing ? MEMO_MAX_LENGTH : undefined}
                readOnly={!canEditMemo || !isMemoEditing}
                placeholder="메모를 입력하세요."
                onClick={() => canEditMemo && setIsMemoEditing(true)}
                onFocus={() => canEditMemo && setIsMemoEditing(true)}
                onBlur={() => canEditMemo && setIsMemoEditing(false)}
                onChange={e => {
                  const next = e.target.value;
                  if (onMemoChange) {
                    onMemoChange(next);
                  } else {
                    setInternalMemo(next);
                  }
                }}
              />
            </div>
          </Tooltip>
          {renderMemoActions && <div className={actionRow()}>{renderMemoActions}</div>}
        </section>
      </div>
    </aside>
  );
};

export default LinkCardDetailPanel;
