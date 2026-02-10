import { tv } from 'tailwind-variants';

export const styles = tv({
  slots: {
    root: 'w-full',
    answerContent: 'text-gray700 text-sm leading-6 whitespace-pre-wrap',
    emptyState: 'text-gray400 text-sm',
    linkList: 'w-full',
    stepList: 'flex flex-col gap-4',
    stepItem: 'border-gray100 rounded-lg border bg-white p-4 shadow-sm',
    stepTitle: 'text-gray900 text-sm font-semibold',
    stepDescription: 'text-gray600 text-sm leading-6',
    section: 'px-6 py-6',
    sectionTitle: 'text-gray500 text-sm font-semibold',
  },
});
