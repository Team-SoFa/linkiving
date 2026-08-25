import { tv } from 'tailwind-variants';

export const styles = tv({
  slots: {
    // 전체화면 ↔ 사이드시트 분기는 md(768px)에 둔다 — useIsMobile 의 기준과 같아야
    // 패널이 전체화면인 구간과 사이드네비가 드로어인 구간이 어긋나지 않는다.
    root: 'bg-gray50 custom-scrollbar fixed inset-0 z-50 w-full overflow-x-hidden overflow-y-auto overscroll-contain pt-[max(0.5rem,env(safe-area-inset-top))] pr-1 md:inset-y-0 md:right-0 md:left-auto md:w-[520px] xl:static xl:h-full xl:w-[520px] xl:pt-2',
    content: 'flex h-full flex-col gap-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]',
    header: 'flex items-center justify-between px-5 py-3',
    section: 'flex flex-col gap-2 px-5 pt-5 pb-4',
    titleCard:
      'custom-scrollbar border-gray100 w-full overflow-y-auto rounded-md border bg-white p-3',
    memoCard:
      'custom-scrollbar border-gray100 w-full overflow-y-auto rounded-md border bg-white p-3',
    actionRow: 'flex items-center gap-2',
    linkActions: 'flex justify-end',
    imageWrapper: 'border-gray100 relative h-[220px] w-full overflow-hidden border bg-white',
    summaryWrapper: 'flex flex-col gap-2',
  },
});
