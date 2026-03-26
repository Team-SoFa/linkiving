'use client';

import { LINE_HEIGHTS } from '@/components/basics/TextArea/TextArea';
import TextArea from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import { useUpdateLinkMemo } from '@/hooks/useUpdateLinkMemo';
import { MAX_MEMO_LENGTH } from '@/lib/constants/link';
import { useEffect, useRef, useState } from 'react';

import CopyButton from '../../CopyButton';
import { styles } from '../LinkCardDetailPanel.style';

interface MemoSectionProps {
  linkId: number;
  memo: string;
}

export default function MemoSection({ linkId, memo }: MemoSectionProps) {
  const { section, linkActions, memoCard } = styles();

  const [internalMemo, setInternalMemo] = useState(memo);
  const [isEditing, setIsEditing] = useState(false);

  const memoAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: updateLinkMemo } = useUpdateLinkMemo();

  useEffect(() => {
    setInternalMemo(memo);
  }, [memo]);

  useEffect(() => {
    if (isEditing && memoAreaRef.current) {
      memoAreaRef.current.focus();
    }
  }, [isEditing]);

  const isSubmittingRef = useRef(false);

  const handleSave = () => {
    if (isSubmittingRef.current) return;

    if (internalMemo !== memo) {
      isSubmittingRef.current = true;
      updateLinkMemo(
        { id: linkId, memo: internalMemo },
        {
          onSettled: () => {
            isSubmittingRef.current = false;
          },
        }
      );
    }
    setIsEditing(false);
  };

  return (
    <section className={section()}>
      {isEditing ? (
        <div
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              handleSave();
            }
          }}
        >
          <TextArea
            ref={memoAreaRef}
            value={internalMemo}
            heightLines={2}
            maxHeightLines={5}
            maxLength={MAX_MEMO_LENGTH}
            showMax
            placeholder="메모를 입력해 주세요"
            onSubmit={handleSave}
            onChange={e => setInternalMemo(e.target.value)}
          />
        </div>
      ) : (
        <Tooltip content="메모 수정하기">
          <div
            className={memoCard()}
            style={{
              minHeight: `${LINE_HEIGHTS.md * 2}px`,
              maxHeight: `${LINE_HEIGHTS.md * 5}px`,
            }}
            role="button"
            tabIndex={0}
            onClick={() => setIsEditing(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsEditing(true);
              }
            }}
          >
            <p
              className={`font-body-md leading-[160%] whitespace-pre-wrap ${internalMemo ? '' : 'text-gray-500'}`}
            >
              {internalMemo || '메모를 입력해주세요.'}
            </p>
          </div>
        </Tooltip>
      )}

      <div className={linkActions()}>
        <CopyButton
          value={internalMemo}
          successMsg="메모를 복사했습니다."
          failMsg="메모 복사에 실패했습니다. 다시 시도해주세요."
          tooltipMsg="메모 복사하기"
          contextStyle="onPanel"
        />
      </div>
    </section>
  );
}
