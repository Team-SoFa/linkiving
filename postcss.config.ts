import tailwind from '@tailwindcss/postcss';
import postcssNesting from 'postcss-nesting';

const config = {
  plugins: [postcssNesting(), tailwind()],
};

export default config;
