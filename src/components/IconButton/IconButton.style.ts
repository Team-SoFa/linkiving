import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'flex cursor-pointer items-center justify-center rounded-full transition-all duration-150',
  variants: {
    variant: {
      primary: 'btn-primary bg-btn-primary border-btn-primary text-btn-primary border',
      secondary: 'btn-secondary bg-btn-secondary border-btn-secondary text-btn-secondary border',
      teritary: 'btn-teritary bg-btn-teritary border-btn-teritary text-btn-teritary border',
      teritary_subtle: 'btn-teritary-subtle bg-btn-teritary-subtle text-btn-teritary-subtle',
    },
    contextStyle: {
      // teritary_subtle 외 다른 variant에서는 무시됨
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
      variant: 'teritary_subtle',
      contextStyle: 'onPanel',
      className: 'bg-btn-teritary-subtle-onpanel',
    },
    {
      variant: 'teritary_subtle',
      contextStyle: 'onMain',
      className: 'bg-btn-teritary-subtle-onmain',
    },
  ],
});
