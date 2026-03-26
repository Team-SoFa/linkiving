import { LINE_HEIGHTS } from '@/components/basics/TextArea/TextArea';
import TextArea from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import { useUpdateLinkTitle } from '@/hooks/useUpdateLinkTitle';
import { MAX_TITLE_LENGTH } from '@/lib/constants/link';
import { useEffect, useRef, useState } from 'react';

import CopyButton from '../../CopyButton';
import { styles } from '../LinkCardDetailPanel.style';

interface TitleSectionProps {
  linkId: number;
  title: string;
  onTitleChange?: (value: string) => void;
}

export default function TitleSection({ linkId, title, onTitleChange }: TitleSectionProps) {
  const { section, titleCard, linkActions } = styles();

  const [internalTitle, setInternalTitle] = useState(title);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const titleAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: updateLinkTitle } = useUpdateLinkTitle();

  useEffect(() => {
    setInternalTitle(title);
  }, [title]);

  useEffect(() => {
    if (isTitleEditing && titleAreaRef.current) {
      titleAreaRef.current.focus();
    }
  }, [isTitleEditing]);

  const isSubmittingRef = useRef(false);
  const handleSave = () => {
    if (isSubmittingRef.current) return; // 재진입 방지
    if (!internalTitle.trim()) {
      setInternalTitle(title);
      setIsTitleEditing(false);
      return;
    }
    if (internalTitle !== title) {
      updateLinkTitle(
        { id: linkId, title: internalTitle },
        {
          onSettled: () => {
            isSubmittingRef.current = false;
          },
        }
      );
    }
    setIsTitleEditing(false);
  };

  return (
    <section className={section()}>
      {isTitleEditing ? (
        <div
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              handleSave();
            }
          }}
        >
          <div className="w-full">
            <TextArea
              value={internalTitle}
              placeholder="제목을 입력해 주세요."
              ref={titleAreaRef}
              heightLines={2}
              maxHeightLines={3}
              maxLength={MAX_TITLE_LENGTH}
              showMax
              onSubmit={() => handleSave()}
              onChange={e => {
                const value = e.target.value;
                setInternalTitle(value);
                onTitleChange?.(value);
              }}
            />
          </div>
        </div>
      ) : (
        <Tooltip content="제목 수정하기" disabled={isTitleEditing}>
          <div
            className={titleCard()}
            style={{
              minHeight: `${LINE_HEIGHTS.md * 2}px`,
              maxHeight: `${LINE_HEIGHTS.md * 3}px`,
            }}
            role="button"
            tabIndex={0}
            onClick={() => setIsTitleEditing(true)}
            onFocus={() => setIsTitleEditing(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsTitleEditing(true);
              }
            }}
          >
            <p className="font-body-md leading-[160%] whitespace-pre-wrap">{internalTitle}</p>
          </div>
        </Tooltip>
      )}

      <div className={linkActions()}>
        <CopyButton
          value={internalTitle}
          successMsg="제목을 복사했습니다."
          failMsg="제목 복사에 실패했습니다. 다시 시도해주세요."
          tooltipMsg="제목 복사하기"
          contextStyle="onPanel"
        />
      </div>
    </section>
  );
}
