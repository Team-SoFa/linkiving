import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'font-detail inline-flex items-center gap-1 rounded-full px-3 py-1.5',
  variants: {
    variant: {
      primary: 'bg-blue400 text-white',
      neutral: 'bg-gray200 text-gray900',
    },
    withIcon: {
      true: 'pr-3 pl-2',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    withIcon: true,
  },
});
