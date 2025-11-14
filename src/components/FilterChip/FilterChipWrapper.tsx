'use client';

import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';

import FilterChips from './FilterChips';
import { Chip } from './useFilterChips';

interface FilterChipWrapperProps extends HTMLAttributes<HTMLDivElement> {
  // apiUrl: string;
  initialChips?: Chip[];
  selected?: boolean;
}

const FilterChipWrapper = forwardRef<HTMLDivElement, FilterChipWrapperProps>(
  function FilterChipWrapper({ initialChips = [], selected = false, ...rest }, ref) {
    const [chips, _setChips] = useState<Chip[]>(initialChips);
    //   const { chips, removeChip, addChip, setAllChips } = useFilterChips();
    //   const [loading, setLoading] = useState(true);

    // 서버에서 초기 데이터 fetch
    //   useEffect(() => {
    //     async function fetchChips() {
    //       try {
    //         const res = await fetch(apiUrl);
    //         const data: Chip[] = await res.json();
    //         setAllChips(data);
    //       } catch (error) {
    //         console.error('Failed to fetch chips:', error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     }
    //     fetchChips();
    //   }, [apiUrl, setAllChips]);

    const baseStyle = selected
      ? 'inline-block px-3 py-1 rounded-full bg-blue-500 text-sm text-white hover:bg-blue-600 cursor-pointer'
      : 'inline-block px-3 py-1 rounded-full bg-gray-200 text-sm text-gray-700 hover:bg-gray-300 cursor-pointer';

    return (
      <div>
        <div className={baseStyle} ref={ref} {...rest}>
          {/* if(loading) return <div>Loading...(나중에 스켈레톤 넣음)</div> */}
          {chips.map(chip => (
            <FilterChips key={chip.id} label={chip.label} />
          ))}
        </div>
      </div>
    );
  }
);

export default FilterChipWrapper;
