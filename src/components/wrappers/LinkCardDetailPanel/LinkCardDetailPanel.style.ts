import { tv } from 'tailwind-variants';

export const styles = tv({
  slots: {
    root: 'bg-gray50 custom-scrollbar h-screen w-[520px] overflow-x-hidden overflow-y-auto pt-2 pr-1',
    content: 'flex h-full flex-col gap-0 pb-6',
    header: 'flex items-center justify-between px-5 py-3',
    section: 'flex flex-col gap-2 px-5 pt-5 pb-4',
    titleCard:
      'custom-scrollbar border-gray100 line-clamp-2 w-full overflow-y-auto rounded-md border bg-white p-3',
    actionRow: 'flex items-center gap-2',
    linkActions: 'flex justify-end',
    imageWrapper: 'border-gray100 relative h-[220px] w-full overflow-hidden border bg-white',
    summaryWrapper: 'flex flex-col gap-2',
  },
});
