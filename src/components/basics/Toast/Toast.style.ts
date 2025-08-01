import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'inline-flex items-center justify-between rounded p-4 shadow-md',
  variants: {
    variant: {
      success: '',
      error: '',
      info: '',
      warning: '',
    },
    theme: {
      light: '',
      dark: '',
    },
  },
  compoundVariants: [
    { variant: 'success', theme: 'light', class: 'bg-feedback-success-light text-default' },
    {
      variant: 'success',
      theme: 'dark',
      class: 'bg-feedback-success-dark [color:var(--label-primary-default)]',
    },

    { variant: 'error', theme: 'light', class: 'bg-feedback-error-light text-default' },
    {
      variant: 'error',
      theme: 'dark',
      class: 'bg-feedback-error-dark [color:var(--label-primary-default)]',
    },

    { variant: 'info', theme: 'light', class: 'bg-feedback-inform-light text-default' },
    {
      variant: 'info',
      theme: 'dark',
      class: 'bg-feedback-inform-dark [color:var(--label-primary-default)]',
    },

    { variant: 'warning', theme: 'light', class: 'bg-feedback-warning-light text-default' },
    {
      variant: 'warning',
      theme: 'dark',
      class: 'bg-feedback-warning-dark [color:var(--text-default)]',
    },
  ],
  defaultVariants: {
    variant: 'info',
    theme: 'dark',
  },
});
