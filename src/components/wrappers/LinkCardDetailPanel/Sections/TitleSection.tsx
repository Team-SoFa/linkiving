import { LINE_HEIGHTS } from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import { MAX_TITLE_LENGTH } from '@/lib/constants/link';
import { useEffect, useRef, useState } from 'react';

import CopyButton from '../../CopyButton';
import { styles } from '../LinkCardDetailPanel.style';
import TitleTextArea from '../TitleTextArea';

interface TitleSectionProps {
  title: string;
  onTitleChange?: (value: string) => void;
}

export default function TitleSection({ title, onTitleChange }: TitleSectionProps) {
  const { section, titleCard, linkActions } = styles();

  const [internalTitle, setInternalTitle] = useState(title);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const titleAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInternalTitle(title);
  }, [title]);

  useEffect(() => {
    if (isTitleEditing && titleAreaRef.current) {
      titleAreaRef.current.focus();
    }
  }, [isTitleEditing]);

  return (
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
            <div className="w-full">
              <TitleTextArea
                ref={titleAreaRef}
                value={internalTitle}
                placeholder="텍스트 에디터에서 제목을 수정해 주세요"
                maxLength={MAX_TITLE_LENGTH}
                onSubmit={() => setIsTitleEditing(false)}
                onChange={e => {
                  const value = e.target.value;
                  setInternalTitle(value);
                  onTitleChange?.(value);
                }}
              />
            </div>
          </Tooltip>
        </div>
      ) : (
        <Tooltip content="제목을 수정해 보세요">
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
