import { tv } from 'tailwind-variants';

export const styles = tv({
  slots: {
    root: 'relative w-full',
    list: 'contents',
    statusRow: 'flex items-center justify-center py-3 text-sm text-gray-500',
    loader: 'animate-pulse',
    end: 'text-gray-500',
    error: 'flex items-center gap-2 text-red-500',
    sentinel: 'h-1 w-full',
    spinner: 'infinite-spinner mr-2',
  },
});
