import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastRun.current >= limit) {
      setThrottledValue(value);
      lastRun.current = now;
    }
  }, [value, limit]);

  return throttledValue;
}
