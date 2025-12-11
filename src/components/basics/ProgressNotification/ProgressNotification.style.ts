import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'font-body-md inline-flex items-center',
  variants: {
    tone: {
      default: 'text-gray500',
      accent: 'text-blue500',
    },
    animated: {
      true: 'animate-pulse',
      false: '',
    },
  },
  defaultVariants: {
    tone: 'default',
    animated: false,
  },
});
