import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'text-anchor inline-flex items-center justify-center gap-1 hover:underline [&>svg]:text-inherit [&>svg]:transition-colors [&>svg]:duration-150 [&>svg]:ease-in-out',
  variants: {
    size: {
      sm: 'font-anchor-sm',
      md: 'font-anchor-md',
    },
  },
});
