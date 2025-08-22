import { useState } from 'react';

export interface Chip {
  id: number;
  label: string;
  selected?: boolean;
}

export function useFilterChips(initialChips: Chip[] = []) {
  const [chips, setChips] = useState<Chip[]>(initialChips);

  // Chip 설정
  const setAllChips = (newChips: Chip[]) => setChips(newChips);

  // Chip 삭제
  const removeChip = (id: number) => {
    setChips(prev => prev.filter(chip => chip.id !== id));
  };

  // Chip 추가
  const addChip = (chip: Chip) => {
    setChips(prev => [...prev, chip]);
  };

  // Chip 토글
  const toggleChip = (id: number) => {
    setChips(prev =>
      prev.map(chip => (chip.id === id ? { ...chip, selected: !chip.selected } : chip))
    );
  };

  return { chips, removeChip, addChip, setAllChips, toggleChip };
}
