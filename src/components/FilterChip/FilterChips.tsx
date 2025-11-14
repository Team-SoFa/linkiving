import { HTMLAttributes, forwardRef } from 'react';

interface FilterChipsProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

const FilterChips = forwardRef<HTMLDivElement, FilterChipsProps>(function FilterChips(
  { label, ...rest },
  ref
) {
  return (
    <div
      className="inline-block cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
      ref={ref}
      {...rest}
    >
      {label}
    </div>
  );
});

export default FilterChips;
