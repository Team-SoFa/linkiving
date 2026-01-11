import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'flex h-10 items-center px-3 text-gray-800 placeholder-gray-400',
  variants: {
    size: {
      sm: 'w-32',
      md: 'w-60',
      lg: 'w-full',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-full',
    },
    variant: {
      outline: 'border border-gray-300 bg-white focus-within:border-gray-600',
      filled: 'bg-blue-200 focus-within:bg-blue-300',
    },
    disabled: {
      true: 'pointer-events-none opacity-50',
      false: '',
    },
  },
});
