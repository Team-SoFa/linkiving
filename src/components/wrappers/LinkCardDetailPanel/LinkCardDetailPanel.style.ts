import { tv } from 'tailwind-variants';

export const styles = tv({
  slots: {
    root: 'bg-gray50 custom-scrollbar h-screen w-[520px] overflow-x-hidden overflow-y-auto pt-2 pr-1',
    content: 'flex h-full flex-col gap-0 pb-6',
    header: 'flex items-center justify-between px-5 py-3',
    headerLeft: 'flex items-center gap-2',
    headerBadge: 'bg-gray900 flex h-4 w-4 items-center justify-center rounded-full',
    divider: 'mx-0 my-2',
    section: 'flex flex-col gap-2 px-5 pt-5 pb-4',
    titleCard: 'rounded-md bg-white p-3 shadow-sm',
    actionRow: 'flex items-center gap-2',
    linkActions: 'flex items-center gap-2 pt-1',
    imageWrapper:
      'border-gray100 relative h-[220px] w-full overflow-hidden border bg-white shadow-sm',
    summaryWrapper: 'flex flex-col gap-2',
    memoWrapper: 'w-[480px]',
  },
});
