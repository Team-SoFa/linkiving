'use client';

import SVGIcon from '@/components/Icons/SVGIcon';
import Badge from '@/components/basics/Badge/Badge';
import Modal from '@/components/basics/Modal/Modal';

import PostReSummaryButton from './PostReSummaryButton';
import useReSummary from './hooks/useReSummary';

const DIFF =
  '어쩌구 저쩌구 어쩌구 저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구 어쩌구저쩌구';
const PREV =
  '기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. 기존 요약입니다. ';
const NEW =
  '새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. 새로운 요약입니다. ';

// interface ReSummary {
//   id: string;
// }

export default function ReSummaryModal() {
  const { loading, writing, error } = useReSummary();

  return (
    <Modal type="RE_SUMMARY" className="m-10 max-w-240 min-w-150">
      <div>
        {loading && (
          <div className="flex gap-2">
            <span>SUMMARY COMPARE</span>
            <SVGIcon icon="IC_SumGenerate" />
            <span>요약 재생성 중입니다...</span>
          </div>
        )}
        {error && <div>에러가 발생했습니다.</div>}
        {!loading && !error && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="font-title-md">요약 비교</span>
              <span className="relative flex gap-2 rounded-lg bg-white p-2">
                <Badge label="WHAT'S CHANGED" className="h-fit" />
                <span className="custom-scrollbar font-body-md max-h-20 w-full overflow-auto">
                  {DIFF}
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-title-sm">기존 요약</span>
                <div className="rounded-lg bg-white p-2">
                  <div className="custom-scrollbar h-45 overflow-auto pr-1">{PREV}</div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-title-sm">재생성 요약</span>
                <div className="rounded-lg bg-white p-2">
                  <div className="custom-scrollbar h-45 overflow-auto pr-1">{NEW}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <PostReSummaryButton type="prev" isWriting={writing} />
              <PostReSummaryButton type="new" isWriting={writing} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
