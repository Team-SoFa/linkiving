import { useEffect, useRef } from "react";
import isEqual from "lodash.isequal"; // npm install --save-dev @types/lodash.isequal

export const useDeepCompareEffect = (effect: () => void, deps: unknown[]) => {
  const previousDepsRef = useRef<unknown[]>([]);

  if (!isEqual(previousDepsRef.current, deps)) {
    previousDepsRef.current = deps;
  }

  useEffect(effect, [previousDepsRef.current]);
};
