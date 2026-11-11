/**
 * Post-build check (run after `npm run build`): every prerendered page, legacy redirect stub
 * and sitemap URL must exist in dist/ as a non-empty HTML file with its route marker.
 * Uses the same SSR bundle as scripts/prerender.mjs, so the expected list follows routes.ts.
 */
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE_URL = 'https://stellamaris.dog';

const { getPrerenderPages, buildLegacyStubs } = await import(
  pathToFileURL(join(ROOT, 'dist-ssr', 'entry-server.js')).href
);

const problems = [];
const readDist = async (file) => {
  try {
    return await readFile(join(DIST, file), 'utf8');
  } catch {
    problems.push(`missing: dist/${file}`);
    return null;
  }
};

const pages = getPrerenderPages();
for (const page of pages) {
  const html = await readDist(page.file);
  if (html === null) continue;
  if (!html.includes(`data-route="${page.routeKey}"`)) problems.push(`no data-route="${page.routeKey}" in dist/${page.file}`);
  if (!html.includes('<title>')) problems.push(`no <title> in dist/${page.file}`);
}

const stubs = buildLegacyStubs();
for (const stub of stubs) await readDist(stub.file);

const sitemap = await readDist('sitemap.xml');
const locs = sitemap ? [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];
if (sitemap && locs.length === 0) problems.push('sitemap.xml has no <loc> entries');
for (const loc of locs) {
  if (!loc.startsWith(`${SITE_URL}/`) || !loc.endsWith('/')) {
    problems.push(`unexpected sitemap URL: ${loc}`);
    continue;
  }
  const file = `${loc.slice(SITE_URL.length + 1)}index.html`;
  if (!pages.some((p) => p.file === file)) problems.push(`sitemap URL is not a prerendered page: ${loc}`);
  await readDist(file);
}

for (const file of ['llms.txt', 'llms-full.txt', 'robots.txt', 'CNAME']) {
  const info = await stat(join(DIST, file)).catch(() => null);
  if (!info?.size) problems.push(`missing or empty: dist/${file}`);
}

if (problems.length) {
  console.error(`dist check failed:\n  ${[...new Set(problems)].join('\n  ')}`);
  process.exit(1);
}
console.log(`dist check passed: ${pages.length} pages, ${stubs.length} redirect stubs, ${locs.length} sitemap URLs`);
