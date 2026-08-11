import type { Preview } from '@storybook/nextjs';

import '../src/styles/globals.css';
import { withQueryClient } from './withQueryClient';

// Storybook 환경에서만 fallback 주입
if (!process.env.NEXT_PUBLIC_BASE_API_URL) {
  process.env.NEXT_PUBLIC_BASE_API_URL = 'http://localhost:3000';
}

if (!process.env.NEXT_PUBLIC_API_TOKEN) {
  process.env.NEXT_PUBLIC_API_TOKEN = 'storybook-mock-token';
}

const preview: Preview = {
  // react-query 를 쓰는 컴포넌트(ChatRoomSection, SideNavigationBottom 등)가
  // "No QueryClient set" 으로 죽지 않도록 전역 Provider 를 씌운다.
  decorators: [withQueryClient],
  parameters: {
    nextjs: {
      appDirectory: true, // App Router 사용 시 필수
      navigation: {
        pathname: '/',
        query: {},
        asPath: '/',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
