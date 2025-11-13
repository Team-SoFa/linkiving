import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'inline-flex cursor-pointer items-center justify-center rounded-full whitespace-nowrap transition-all duration-150',
  variants: {
    variant: {
      primary: 'btn-primary bg-btn-primary border-btn-primary text-btn-primary border',
      secondary: 'btn-secondary bg-btn-secondary border-btn-secondary text-btn-secondary border',
      tertiary: 'btn-tertiary bg-btn-tertiary border-btn-tertiary text-btn-tertiary border',
      neutral: 'btn-neutral bg-btn-neutral text-btn-neutral',
    },
    contextStyle: {
      // neutral 외 다른 variant에서는 무시됨
      onMain: '',
      onPanel: '',
    },
    radius: {
      md: 'rounded-lg',
      full: 'rounded-full',
    },
    size: {
      sm: 'font-label-sm px-3 py-2',
      md: 'font-label-md px-4 py-[10px]',
      lg: 'font-label-lg px-5 py-3',
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
