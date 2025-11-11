import { tv } from 'tailwind-variants';

export const style = tv({
  base: [
    'pointer-events-none absolute z-50 rounded border border-black bg-black px-2 py-1 text-xs leading-tight font-medium tracking-wide whitespace-nowrap text-white shadow-lg',
  ],
  variants: {
    side: {
      top: 'bottom-full mb-1',
      bottom: 'top-full mt-1',
      left: 'right-full mr-1',
      right: 'left-full ml-1',
    },
  },
});
