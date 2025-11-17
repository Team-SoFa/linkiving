import { tv } from 'tailwind-variants';

export const style = tv({
  base: [
    'pointer-events-none absolute z-50 rounded-lg border px-3 py-2 text-xs leading-tight font-medium tracking-wide whitespace-nowrap shadow-lg',
  ],
  variants: {
    side: {
      top: 'bottom-full',
      bottom: 'top-full',
      left: 'right-full',
      right: 'left-full',
    },
  },
});
