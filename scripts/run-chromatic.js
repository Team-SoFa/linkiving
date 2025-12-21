// Helper to run Chromatic using env tokens.
// It prefers CHROMATIC_PROJECT_TOKEN; if absent, falls back to STORYBOOK_TOKEN.
import { spawnSync } from 'node:child_process';

const env = { ...process.env };

if (!env.CHROMATIC_PROJECT_TOKEN && env.STORYBOOK_TOKEN) {
  env.CHROMATIC_PROJECT_TOKEN = env.STORYBOOK_TOKEN;
}

if (!env.CHROMATIC_PROJECT_TOKEN) {
  console.error('Missing CHROMATIC_PROJECT_TOKEN (or STORYBOOK_TOKEN).');
  process.exit(1);
}

const result = spawnSync('pnpm', ['exec', 'chromatic'], {
  stdio: 'inherit',
  env,
  shell: true,
});

process.exit(result.status ?? 1);
