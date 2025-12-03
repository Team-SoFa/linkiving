import { tv } from 'tailwind-variants';

export const wholeBoxStyle = tv({
  base: 'relative inline-block w-full border bg-white pt-2 pr-1 pb-6 pl-3',
  variants: {
    variant: {
      default: 'border-gray100 focus-within:border-gray300',
    },
    radius: {
      md: 'rounded',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
});

export const textAreaStyle = tv({
  base: 'placeholder:text-gray500 text-gray900 custom-scrollbar w-full resize-none pr-3 focus:outline-none',
  variants: {
    textSize: {
      sm: 'font-body-sm',
      md: 'font-body-md',
      lg: 'font-body-lg',
    },
  },
});
