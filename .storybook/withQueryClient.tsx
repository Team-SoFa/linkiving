import type { Decorator } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

/**
 * react-query 를 쓰는 컴포넌트가 Storybook 에서 "No QueryClient set" 으로
 * 죽지 않도록 전역으로 씌우는 Provider.
 *
 * 스토리별로 데이터를 시드하고 싶으면 스토리 데코레이터에서 자체 QueryClient 로
 * 한 번 더 감싸면 된다 (가까운 Provider 가 이긴다).
 */
export const withQueryClient: Decorator = Story => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  return (
    <QueryClientProvider client={client}>
      <Story />
    </QueryClientProvider>
  );
};

export default withQueryClient;
