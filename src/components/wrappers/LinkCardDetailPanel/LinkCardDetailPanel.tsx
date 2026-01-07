'use client';

import SVGIcon from '@/components/Icons/SVGIcon';
import AccordionButton from '@/components/basics/Accordion/AccordionButton/AccordionButton';
import Anchor from '@/components/basics/Anchor/Anchor';
import Button from '@/components/basics/Button/Button';
import Divider from '@/components/basics/Divider/Divider';
import IconButton from '@/components/basics/IconButton/IconButton';
import Label from '@/components/basics/Label/Label';
import ProgressNotification from '@/components/basics/ProgressNotification/ProgressNotification';
import TextArea from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import { styles } from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel.style';
import TitleTextArea from '@/components/wrappers/LinkCardDetailPanel/TitleTextArea';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

type ActionNodes = React.ReactNode | null;

type SummaryState = 'idle' | 'loading' | 'writing' | 'error' | 'ready';

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
  summaryState?: SummaryState;
  summaryErrorMessage?: string;
  onClose?: () => void;
  onMore?: () => void;
  onTitleChange?: (value: string) => void;
  onMemoChange?: (value: string) => void;
  onRegenerateSummary?: () => void;
  onRetrySummary?: () => void;
}

const TITLE_MAX_LENGTH = 100;
const MEMO_MAX_LENGTH = 200;

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
  summaryState: summaryStateProp = 'idle',
  summaryErrorMessage,
  onClose,
  onMore,
  onTitleChange,
  onMemoChange,
  onRegenerateSummary,
  onRetrySummary,
}: LinkCardDetailPanelProps) => {
  const safeUrl = getSafeUrl(url);
  const memoAreaRef = useRef<HTMLTextAreaElement>(null);
  const titleAreaRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const isInteractiveSummary =
    summaryStateProp === 'ready' || summaryStateProp === 'idle' || summaryStateProp === 'writing';
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

    const shouldMeasure =
      summaryStateProp === 'ready' || summaryStateProp === 'writing' || summaryStateProp === 'idle';
    if (!shouldMeasure) return undefined;

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
  }, [summary, summaryStateProp]);

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
    ) : (
      <div className="flex items-center gap-2">
        <IconButton
          icon="IC_Copy"
          size="sm"
          variant="tertiary_subtle"
          contextStyle="onPanel"
          ariaLabel="copy link"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && safeUrl) {
              navigator.clipboard.writeText(safeUrl);
            }
          }}
        />
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
    );

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
    ) : summaryStateProp === 'loading' ||
      summaryStateProp === 'error' ? null : onRegenerateSummary ||
      (summary && isInteractiveSummary) ? (
      <div className="flex items-center justify-end gap-2 pt-2">
        {onRegenerateSummary && (
          <Button
            size="sm"
            variant="tertiary_subtle"
            contextStyle="onPanel"
            icon="IC_SumGenerate"
            label="요약 다시 생성"
            onClick={onRegenerateSummary}
          />
        )}
        {summary && isInteractiveSummary && (
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
        )}
      </div>
    ) : null;

  const renderMemoActions = memoActions ?? null;

  const renderSummaryBox = (children: React.ReactNode, footer?: React.ReactNode) => (
    <div className="flex w-full flex-col items-center gap-4 px-5 py-6 text-center">
      {children}
      {footer}
    </div>
  );

  const renderSummaryContent = () => {
    if (summaryStateProp === 'loading') {
      return (
        <div className="text-gray500 flex min-h-[172px] w-full flex-col items-start justify-start gap-2 px-3 py-3">
          <ProgressNotification
            label="요약 생성 중..."
            icon="IC_SumGenerate"
            tone="default"
            animated={false}
            className="text-gray500 inline-flex items-center gap-2 px-0 py-0"
          />
        </div>
      );
    }

    if (summaryStateProp === 'error') {
      return (
        <div className="flex flex-col items-center gap-4 px-2 py-4 text-center">
          <ProgressNotification
            icon="IC_Info"
            label={summaryErrorMessage || '일시적 오류로 요약을 생성하지 못했습니다.'}
            className="text-gray700 inline-flex items-center gap-3 px-4 py-3"
          />
          {onRetrySummary && (
            <Button
              size="sm"
              variant="primary"
              contextStyle="onPanel"
              icon="IC_Regenerate"
              label="다시 시도"
              onClick={onRetrySummary}
            />
          )}
        </div>
      );
    }

    const showSummary =
      summaryStateProp === 'ready' || summaryStateProp === 'writing' || summaryStateProp === 'idle';

    if (!showSummary || !summary) {
      return renderSummaryBox(
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray500 text-sm">요약이 아직 준비되지 않았어요.</p>
        </div>
      );
    }

    return (
      <div className={summaryWrapper()}>
        <div className="flex items-start gap-2">
          <p
            ref={summaryRef}
            className={`font-body-md text-gray900 max-w-[480px] leading-[160%] whitespace-pre-wrap ${
              isSummaryExpanded ? '' : 'line-clamp-5'
            }`}
          >
            {summary}
          </p>
        </div>
        {isSummaryOverflowing && (
          <div className="text-gray500 mt-1 flex items-center gap-2">
            <AccordionButton
              isOpen={isSummaryExpanded}
              setIsOpen={setIsSummaryExpanded}
              openTitle="간략히"
              closeTitle="자세히"
            />
          </div>
        )}
        {summaryStateProp === 'writing' && (
          <p className="text-gray600 text-sm">요약을 다듬는 중이에요.</p>
        )}
      </div>
    );
  };

  return (
    <aside className={root()}>
      <div className={content()}>
        {/* Header */}
        <header className={header()}>
          <div className="border-gray100 bg-gray50 flex flex-1 items-center gap-3 rounded-md border px-3 py-2">
            <SVGIcon icon="IC_LinkOpen" size="md" className="text-gray600" aria-hidden="true" />
            <div className="flex-1 truncate">
              {safeUrl ? (
                <Anchor href={safeUrl} target="_blank" size="sm" className="text-gray700">
                  {safeUrl}
                </Anchor>
              ) : (
                <span className="text-gray500 font-body-sm">유효하지 않은 URL</span>
              )}
            </div>
            {renderHeaderActions}
          </div>
        </header>
        <Divider color="gray200" className={divider()} />

        {/* Title */}
        <section className={section()}>
          {isTitleEditing ? (
            <div
              onBlur={e => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsTitleEditing(false);
                }
              }}
            >
              <Tooltip content="제목을 수정해 보세요">
                <div className="w-[480px]">
                  <TitleTextArea
                    ref={titleAreaRef}
                    value={internalTitle}
                    placeholder="텍스트 에디터에서 제목을 수정해 주세요"
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
            <Tooltip content="제목을 수정해 보세요">
              <div
                className={`${titleCard()} line-clamp-2`}
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
              label="링크 열기"
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

        {/* Image */}
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

        {/* Summary */}
        <section className={section()}>
          <Label textSize="sm" className="text-gray900">
            요약
          </Label>
          {renderSummaryContent()}
          {renderSummaryActions}
        </section>
        <Divider color="gray200" className={divider()} />

        {/* Memo */}
        <section className={section()}>
          <Label textSize="sm" className="text-gray900">
            메모
          </Label>
          <Tooltip content="메모를 적어 두세요">
            <div className={`${memoWrapper()} w-full max-w-full`}>
              <TextArea
                ref={memoAreaRef}
                value={internalMemo}
                className="w-full max-w-full"
                heightLines={2}
                maxHeightLines={6}
                maxLength={isMemoEditing ? MEMO_MAX_LENGTH : undefined}
                readOnly={!memoEditable || !isMemoEditing}
                placeholder="메모를 입력해 주세요"
                onClick={() => memoEditable && setIsMemoEditing(true)}
                onFocus={() => memoEditable && setIsMemoEditing(true)}
                onBlur={() => memoEditable && setIsMemoEditing(false)}
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
