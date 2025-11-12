import type { StorybookConfig } from '@storybook/nextjs';
import type { RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],

  webpackFinal: async config => {
    if (!config?.module?.rules) return config;
    const rules = (config.module.rules as RuleSetRule[]).filter(
      (rule): rule is RuleSetRule => typeof rule === 'object' && rule !== null
    );

    config.module.rules = rules.map(rule => {
      if (rule.test instanceof RegExp && rule.test.test('file.svg')) {
        return { ...rule, exclude: /\.svg$/i };
      }
      return rule;
    });

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
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
