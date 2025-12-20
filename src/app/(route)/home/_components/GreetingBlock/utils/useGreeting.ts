import { useMemo } from 'react';

import { greetingText } from './greeting';

export function useGreeting(context?: string) {
  // 렌더링마다 문구가 바뀌지 않도록 메모이징
  const text = useMemo(() => greetingText(context), [context]);
  return text;
}
