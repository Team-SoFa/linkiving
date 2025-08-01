import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'inline-flex items-center justify-between rounded p-4 shadow-md',
  variants: {
    variant: {
      success:
        '[background-color:var(--feedback-success-dark)] [color:var(--label-primary-default)]',
      error: '[background-color:var(--feedback-error-dark)] [color:var(--label-primary-default)]',
      info: '[background-color:var(--feedback-inform-dark)] [color:var(--label-primary-default)]',
      warning: '[background-color:var(--feedback-warning-dark)] [color:var(--text-default)]',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});
