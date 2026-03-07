'use client';

import Badge from '@/components/basics/Badge/Badge';
import IconButton from '@/components/basics/IconButton/IconButton';
import Modal from '@/components/basics/Modal/Modal';
import ProgressNotification from '@/components/basics/ProgressNotification/ProgressNotification';
import useReSummary from '@/hooks/useReSummary';
import useSelectSummary from '@/hooks/useSelectSummary';
import MarkdownRenderer from '@/hooks/util/parseMarkdown';
import clsx from 'clsx';
import { useEffect } from 'react';

import PostReSummaryButton from './PostReSummaryButton';

interface ReSummaryProps {
  linkId: number;
}

export default function ReSummaryModal({ linkId }: ReSummaryProps) {
  const { mutate, isLoading, error, data } = useReSummary(linkId);
  const { mutate: selectSummary, isPending: isSaving } = useSelectSummary();

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  const prevContent = data?.existingSummary ?? '';
  const newContent = data?.newSummary ?? '';
  const comparison = data?.comparison ?? '';

  const handleSelectNew = () => {
    if (!data) return;
    selectSummary({
      id: linkId,
      summary: newContent,
      format: 'CONCISE',
    });
  };

  return (
    <Modal
      type="RE_SUMMARY"
      className={clsx('m-10 max-w-240 min-w-150', error && 'border-red500 border')}
    >
      <div className="gap-2 p-6">
        <span className="font-title-md">요약 비교</span>
        {isLoading && (
          <div className="text-gray500 mb-63.5">
            <ProgressNotification animated={isLoading} />
          </div>
        )}
        {error && (
          <div className="text-red500 mb-64 flex items-center gap-2">
            <span className="font-body-md">요약 재생성 중 문제가 발생했습니다.</span>
            <IconButton
              icon="IC_Regenerate"
              size="sm"
              variant="tertiary_subtle"
              ariaLabel="요약 재생성 재시도"
              onClick={() => mutate()}
            />
          </div>
        )}
        {!isLoading && !error && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="relative flex items-center gap-2 rounded-lg bg-white p-2">
                <Badge icon="IC_SumGenerate" label="어떻게 바뀌었나요?" className="h-fit" />
                <span className="font-label-md w-full truncate">{comparison}</span>
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-label-sm">기존 요약</span>
                <div className="rounded-lg bg-white p-2">
                  <div className="custom-scrollbar font-body-md h-45 overflow-y-auto pr-1 wrap-break-word">
                    <MarkdownRenderer content={prevContent} />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-label-sm">재생성 요약</span>
                <div className="rounded-lg bg-white p-2">
                  <div className="custom-scrollbar font-body-md h-45 overflow-auto pr-1 wrap-break-word">
                    <MarkdownRenderer content={newContent} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <PostReSummaryButton type="prev" disabled={isLoading || isSaving} />
          <PostReSummaryButton
            type="new"
            disabled={!!error || isLoading || isSaving}
            loading={isLoading || isSaving}
            onClick={handleSelectNew}
          />
        </div>
      </div>
    </Modal>
  );
}
