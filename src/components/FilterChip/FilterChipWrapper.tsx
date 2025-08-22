'use client';

import { useState } from 'react';
import FilterChips from './FilterChips';
import { Chip } from './useFilterChips';

interface FilterChipWrapperProps {
  // apiUrl: string;
  initialChips?: Chip[];
}

export default function FilterChipWrapper({ initialChips = [] }: FilterChipWrapperProps) {
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

  const baseStyle = 'flex flex-wrap gap-2';

  return (
    <div>
      <div className={baseStyle}>
        {/* if(loading) return <div>Loading...(나중에 스켈레톤 넣음)</div> */}
        {chips.map(chip => (
          <FilterChips key={chip.id} label={chip.label} />
        ))}
      </div>
    </div>
  );
}
