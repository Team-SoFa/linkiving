import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'flex cursor-pointer items-center justify-center rounded-full transition-all duration-150',
  variants: {
    variant: {
      primary: 'btn-primary bg-btn-primary border-btn-primary text-btn-primary border',
      secondary: 'btn-secondary bg-btn-secondary border-btn-secondary text-btn-secondary border',
      tertiary: 'btn-tertiary bg-btn-tertiary text-btn-tertiary',
      neutral: 'btn-neutral bg-btn-neutral text-btn-neutral',
    },
    contextStyle: {
      // neutral 외 다른 variant에서는 무시됨
      onMain: '',
      onPanel: '',
    },
    size: {
      sm: 'h-8 w-8',
      md: 'h-9 w-9',
      lg: 'h-10 w-10',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-30',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'neutral',
      contextStyle: 'onPanel',
      className: 'bg-btn-neutral-onpanel',
    },
    {
      variant: 'neutral',
      contextStyle: 'onMain',
      className: 'bg-btn-neutral-onmain',
    },
  ],
});
