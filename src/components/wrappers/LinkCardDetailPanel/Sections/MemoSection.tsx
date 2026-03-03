'use client';

import Label from '@/components/basics/Label/Label';
import TextArea from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import { MAX_MEMO_LENGTH } from '@/lib/constants/link';
import { useEffect, useRef, useState } from 'react';

import CopyButton from '../../CopyButton';
import { styles } from '../LinkCardDetailPanel.style';

interface MemoSectionProps {
  memo: string;
  memoEditable?: boolean;
  onMemoChange?: (value: string) => void;
}

export default function MemoSection({ memo, memoEditable = true, onMemoChange }: MemoSectionProps) {
  const { section, linkActions, actionRow } = styles();

  const [internalMemo, setInternalMemo] = useState(memo);
  const [isEditing, setIsEditing] = useState(false);

  const memoAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInternalMemo(memo);
  }, [memo]);

  useEffect(() => {
    if (isEditing && memoAreaRef.current) {
      memoAreaRef.current.focus();
    }
  }, [isEditing]);

  const handleCommit = () => {
    if (!memoEditable || !isEditing) return;
    if (internalMemo !== memo) {
      onMemoChange?.(internalMemo);
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
          readOnly={!memoEditable || !isEditing}
          placeholder="메모를 입력해 주세요"
          onClick={() => memoEditable && setIsEditing(true)}
          onFocus={() => memoEditable && setIsEditing(true)}
          onSubmit={handleCommit}
          onBlur={handleCommit}
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
