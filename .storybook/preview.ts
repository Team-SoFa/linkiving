// .storybook/preview.ts

// ① 프로젝트 전역에 선언된 Tailwind 디렉티브를 먼저 불러옵니다.
import "../src/styles/globals.css";

import type { Preview } from "@storybook/react";

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
