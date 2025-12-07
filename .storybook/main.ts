import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],

  webpackFinal: async config => {
    // 기존 SVG 처리 규칙 찾아서 제거
    const fileLoaderRule = config.module?.rules?.find(rule => {
      if (typeof rule !== 'object' || !rule) return false;
      if ('test' in rule && rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
      return false;
    });

    if (fileLoaderRule && typeof fileLoaderRule === 'object') {
      // SVG는 제외
      fileLoaderRule.exclude = /\.svg$/;
    }

    // SVG를 React 컴포넌트로 처리하는 규칙 추가
    config.module?.rules?.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

export default config;
