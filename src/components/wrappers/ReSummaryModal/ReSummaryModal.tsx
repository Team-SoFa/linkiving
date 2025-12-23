'use client';

import Badge from '@/components/basics/Badge/Badge';
import IconButton from '@/components/basics/IconButton/IconButton';
import Modal from '@/components/basics/Modal/Modal';
import ProgressNotification from '@/components/basics/ProgressNotification/ProgressNotification';
import clsx from 'clsx';
import { useEffect } from 'react';

import NewSummary from './NewSummary';
import PostReSummaryButton from './PostReSummaryButton';
import PrevSummary from './PrevSummary';
import useReSummary from './hooks/useReSummary';

interface ReSummaryProps {
  summaryId: number;
}

export default function ReSummaryModal({ summaryId }: ReSummaryProps) {
  const { mutate, isLoading, error, data } = useReSummary(summaryId);

  useEffect(() => {
    mutate();
  }, [mutate, summaryId]);

  const prevContent = data?.existingSummary ?? '';
  const newContent = data?.newSummary ?? '';
  const comparison = data?.comparison ?? '';

  return (
    <Modal
      type="RE_SUMMARY"
      className={clsx('m-10 max-w-240 min-w-150', error && 'border-red500 border')}
    >
      <div className="p-2">
        <span className="font-title-md">요약 비교</span>
        {isLoading && (
          <div className="text-gray500 flex gap-2">
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
            />
          </div>
        )}
        {!isLoading && !error && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="relative flex items-center gap-2 rounded-lg bg-white p-2">
                <Badge icon="IC_SumGenerate" label="변화 지점" className="h-fit" />
                <span className="font-label-md w-full truncate">{comparison}</span>
              </span>
            </div>
            <div className="flex gap-2">
              <PrevSummary content={prevContent} />
              <NewSummary content={newContent} />
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <PostReSummaryButton type="prev" disabled={isLoading} />
          <PostReSummaryButton
            type="new"
            disabled={!!error || isLoading}
            onClick={() => console.log('new')} // TODO: 재생성된 요약 저장 api 구현 후 연결
          />
        </div>
      </div>
    </Modal>
  );
}
