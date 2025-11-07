import { tv } from 'tailwind-variants';

export const styles = tv({
  base: 'relative isolate overflow-hidden select-none',
  variants: {
    radius: {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    animated: {
      true: 'animate-pulse',
      false: '',
    },
  },
});
