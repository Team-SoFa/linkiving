import { MouseEventHandler, Ref, useRef } from 'react';

export function useBlurOnClick<T extends HTMLButtonElement = HTMLButtonElement>(
  onClick?: MouseEventHandler<T>
): { ref: Ref<T>; onClick: MouseEventHandler<T> } {
  const ref = useRef<T | null>(null);

  const handleClick: MouseEventHandler<T> = e => {
    onClick?.(e);
    ref.current?.blur();
  };

  return { ref, onClick: handleClick };
}
