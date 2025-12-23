'use client';

import Badge from '@/components/basics/Badge/Badge';
import IconButton from '@/components/basics/IconButton/IconButton';
import Modal from '@/components/basics/Modal/Modal';
import ProgressNotification from '@/components/basics/ProgressNotification/ProgressNotification';
import clsx from 'clsx';

import NewSummary from './NewSummary';
import PostReSummaryButton from './PostReSummaryButton';
import PrevSummary from './PrevSummary';
import useReSummary from './hooks/useReSummary';

const DIFF =
  '어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구';

// interface ReSummaryProps {
//   id: number;
// }

export default function ReSummaryModal() {
  const { loading, writing, error } = useReSummary();

  const prevContent = '이전요약이전요약';
  const newContent = '새 요약 새 요약';
  // TODO: api 연결(아직 api 작성 안함)

  return (
    <Modal
      type="RE_SUMMARY"
      className={clsx('m-10 max-w-240 min-w-150', error && 'border-red500 border')}
    >
      <div className="p-2">
        <span className="font-title-md">요약 비교</span>
        {loading && (
          <div className="text-gray500 flex gap-2">
            <ProgressNotification animated={loading} />
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
        {!loading && !error && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="relative flex items-center gap-2 rounded-lg bg-white p-2">
                <Badge icon="IC_SumGenerate" label="변화 지점" className="h-fit" />
                <span className="font-label-md w-full truncate">{DIFF}</span>
              </span>
            </div>
            <div className="flex gap-2">
              <PrevSummary content={prevContent} />
              <NewSummary content={newContent} />
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <PostReSummaryButton type="prev" disabled={writing} onClick={() => console.log('prev')} />
          <PostReSummaryButton
            type="new"
            disabled={!!error || loading || writing}
            onClick={() => console.log('new')}
          />
        </div>
      </div>
    </Modal>
  );
}
