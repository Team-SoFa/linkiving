'use client';

import Label from '@/components/basics/Label/Label';
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
  const { section, linkActions } = styles();

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
    if (isSubmittingRef.current) return; // 재진입 방지

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
      <Label textSize="sm" className="text-gray900">
        메모
      </Label>

      <Tooltip content="메모를 적어 두세요">
        <TextArea
          ref={memoAreaRef}
          value={internalMemo}
          heightLines={2}
          maxHeightLines={5}
          maxLength={isEditing ? MAX_MEMO_LENGTH : undefined}
          readOnly={!isEditing}
          placeholder="메모를 입력해 주세요"
          onClick={() => setIsEditing(true)}
          onFocus={() => setIsEditing(true)}
          onSubmit={handleSave}
          onBlur={handleSave}
          onChange={e => setInternalMemo(e.target.value)}
        />
      </Tooltip>

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
