'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

type Props = { children: ReactNode };

export default function ReactQueryProvider({ children }: Props) {
  // 클라이언트 렌더링 시 한 번만 생성
  const [client] = useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
