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
    setChips(prev => {
      // 칩 중복 추가 방지 처리
      if (prev.some(existingChip => existingChip.id === chip.id)) {
        console.warn(`Chip with id ${chip.id} already exists`);
        return prev;
      }
      return [...prev, chip];
    });
  };

  // Chip 토글
  const toggleChip = (id: number) => {
    setChips(prev => {
      const chipExists = prev.some(chip => chip.id === id); // 존재하지 않는 칩 토글 방지 처리
      if (!chipExists) {
        console.warn(`Chip with id ${id} not found`);
        return prev;
      }
      return prev.map(chip => (chip.id === id ? { ...chip, selected: !chip.selected } : chip));
    });
  };

  return { chips, removeChip, addChip, setAllChips, toggleChip };
}
