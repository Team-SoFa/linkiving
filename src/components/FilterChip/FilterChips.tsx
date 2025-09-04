'use client';

interface FilterChipsProps {
  label: string;
}

export default function FilterChips({ label }: FilterChipsProps) {
  const baseStyle =
    'inline-block px-3 py-1 rounded-full bg-gray-200 text-sm text-gray-700 hover:bg-gray-300 cursor-pointer';

  return <div className={baseStyle}>{label}</div>;
}
