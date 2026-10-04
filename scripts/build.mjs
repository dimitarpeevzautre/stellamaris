#!/usr/bin/env node
/**
 * `npm run build`: the client build, the SSR build and the prerender step, in that order.
 *
 * All three read the build date (vite.config.ts __BUILD_DATE__, the sitemap fallback date in
 * scripts/prerender.mjs). Setting BUILD_DATE once here keeps them identical even when a build
 * runs across midnight UTC, so the prerendered HTML (next-litter banner, copyright year) always
 * matches the client's first render. An existing BUILD_DATE (YYYY-MM-DD) is respected.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VITE = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const PRERENDER = fileURLToPath(new URL('./prerender.mjs', import.meta.url));

process.env.BUILD_DATE ??= new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(process.env.BUILD_DATE)) {
  throw new Error(`BUILD_DATE must be YYYY-MM-DD, got "${process.env.BUILD_DATE}"`);
}
console.log(`BUILD_DATE=${process.env.BUILD_DATE}`);

const steps = [
  [VITE, 'build'],
  [VITE, 'build', '--ssr', 'entry-server.tsx'],
  [PRERENDER],
];
for (const args of steps) {
  const { status, error } = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (error) throw error;
  if (status !== 0) process.exit(status ?? 1);
}
