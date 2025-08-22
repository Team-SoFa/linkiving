'use client';

import clsx from 'clsx';
import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';

import FilterChips from './FilterChips';
import { Chip } from './useFilterChips';

interface FilterChipWrapperProps extends HTMLAttributes<HTMLDivElement> {
  initialChips?: Chip[];
}

const FilterChipWrapper = forwardRef<HTMLDivElement, FilterChipWrapperProps>(
  function FilterChipWrapper({ initialChips = [], className, ...rest }, ref) {
    const [chips, _setChips] = useState<Chip[]>(initialChips);
    return (
      <div>
        <div className={clsx('flex gap-1', className)} ref={ref} {...rest}>
          {chips.map(chip => (
            <FilterChips key={chip.id} label={chip.label} />
          ))}
        </div>
      </div>
    );
  }
);

export default FilterChipWrapper;
