import clsx from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

interface FilterChipsProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

const FilterChips = forwardRef<HTMLDivElement, FilterChipsProps>(function FilterChips(
  { label, className, ...rest },
  ref
) {
  return (
    <div
      className={clsx(
        'inline-block cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-300',
        className
      )}
      ref={ref}
      {...rest}
    >
      {label}
    </div>
  );
});

export default FilterChips;
