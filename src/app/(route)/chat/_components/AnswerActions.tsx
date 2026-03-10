'use client';

import Button from '@/components/basics/Button/Button';
import IconButton from '@/components/basics/IconButton/IconButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basics/Popover';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import CopyButton from '@/components/wrappers/CopyButton';

export type AnswerReaction = 'up' | 'down' | null;

interface AnswerActionsProps {
  copyValue: string;
  menuKey: string;
  reaction?: AnswerReaction;
  onReactionChange: (reaction: AnswerReaction) => void;
  onRegenerate?: () => void;
  onReport?: () => void;
}

export default function AnswerActions({
  copyValue,
  menuKey,
  reaction = null,
  onReactionChange,
  onRegenerate,
  onReport,
}: AnswerActionsProps) {
  const noActiveBgClass =
    'text-gray500 hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:outline-none';
  const copyButtonClass =
    'text-gray500 hover:bg-transparent active:!bg-gray100 focus:!bg-gray100 focus-visible:outline-none';
  const moreButtonClass =
    'text-gray500 hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:outline-none aria-expanded:border-gray300 aria-expanded:!bg-gray100';

  return (
    <div className="mb-3 flex items-center gap-1.5">
      <CopyButton
        value={copyValue}
        successMsg="답변을 복사했습니다."
        failMsg="답변 복사에 실패했습니다."
        tooltipMsg="답변 복사"
        size="md"
        className={copyButtonClass}
      />

      <Tooltip content="좋아요" side="bottom">
        <div>
          <IconButton
            icon={reaction === 'up' ? 'IC_ThumbUpFilled' : 'IC_ThumbUpOutline'}
            size="md"
            variant="tertiary_subtle"
            contextStyle="onMain"
            className={noActiveBgClass}
            ariaLabel="좋아요"
            onClick={() => onReactionChange(reaction === 'up' ? null : 'up')}
          />
        </div>
      </Tooltip>

      <Tooltip content="싫어요" side="bottom">
        <div>
          <IconButton
            icon={reaction === 'down' ? 'IC_ThumbDownFilled' : 'IC_ThumbDownOutline'}
            size="md"
            variant="tertiary_subtle"
            contextStyle="onMain"
            className={noActiveBgClass}
            ariaLabel="싫어요"
            onClick={() => onReactionChange(reaction === 'down' ? null : 'down')}
          />
        </div>
      </Tooltip>

      <Tooltip content="다시 생성" side="bottom">
        <div>
          <IconButton
            icon="IC_Regenerate"
            size="md"
            variant="tertiary_subtle"
            contextStyle="onMain"
            className={noActiveBgClass}
            ariaLabel="다시 생성"
            onClick={onRegenerate}
          />
        </div>
      </Tooltip>

      <Popover placement="top-start">
        <PopoverTrigger popoverKey={menuKey}>
          <IconButton
            icon="IC_MoreVert"
            size="md"
            variant="tertiary_subtle"
            contextStyle="onMain"
            className={moreButtonClass}
            ariaLabel="더보기"
          />
        </PopoverTrigger>
        <PopoverContent popoverKey={menuKey}>
          {close => (
            <Button
              label="문제 보내기"
              variant="tertiary_subtle"
              contextStyle="onPanel"
              size="sm"
              radius="full"
              className="m-2 !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent"
              onClick={() => {
                close();
                onReport?.();
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
