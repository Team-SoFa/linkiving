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
    { variant: 'success', theme: 'light', class: 'bg-success-light text-default' },
    {
      variant: 'success',
      theme: 'dark',
      class: 'bg-success-dark [color:var(--label-primary-default)]',
    },

    { variant: 'error', theme: 'light', class: 'bg-error-light text-default' },
    {
      variant: 'error',
      theme: 'dark',
      class: 'bg-error-dark [color:var(--label-primary-default)]',
    },

    { variant: 'info', theme: 'light', class: 'bg-inform-light text-default' },
    {
      variant: 'info',
      theme: 'dark',
      class: 'bg-inform-dark [color:var(--label-primary-default)]',
    },

    { variant: 'warning', theme: 'light', class: 'bg-warning-light text-default' },
    {
      variant: 'warning',
      theme: 'dark',
      class: 'bg-warning-dark [color:var(--text-default)]',
    },
  ],
  defaultVariants: {
    variant: 'info',
    theme: 'dark',
  },
});
