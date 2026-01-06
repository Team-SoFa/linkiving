import type { Preview } from '@storybook/nextjs-vite';

import '../src/styles/globals.css';

// Storybook 환경에서만 fallback 주입
if (!process.env.NEXT_PUBLIC_BASE_API_URL) {
  process.env.NEXT_PUBLIC_BASE_API_URL = 'http://localhost:3000';
}

if (!process.env.NEXT_PUBLIC_API_TOKEN) {
  process.env.NEXT_PUBLIC_API_TOKEN = 'storybook-mock-token';
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
