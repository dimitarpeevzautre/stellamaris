#!/usr/bin/env node
/**
 * Build step 3 of 3 (after the client build and the SSR build, see package.json "build").
 *
 * For every page in routes.ts (each language) renders the app to static HTML and writes
 * dist/<path>/index.html with the page's own <title>, meta, canonical, hreflang and
 * <html lang>. Also writes dist/404.html, dist/sitemap.xml and redirect stubs for URLs
 * of the previous site, the per-page JSON-LD and /llms.txt + /llms-full.txt. All route knowledge lives in routes.ts / seo.ts (via the SSR bundle).
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SSR_ENTRY = join(ROOT, 'dist-ssr', 'entry-server.js');
const MANIFEST = join(DIST, '.vite', 'manifest.json');

const {
  render,
  getPrerenderPages,
  renderHeadTags,
  buildSitemap,
  getSitemapRoutes,
  getDateModified,
  buildLegacyStubs,
  buildJsonLd,
  serializeJsonLd,
  buildLlmsTxt,
  buildLlmsFullTxt,
  NOT_FOUND_ROUTE_KEY,
  NOT_FOUND_META,
  LANGUAGES,
  localizePath,
} = await import(pathToFileURL(SSR_ENTRY).href);

/** Per-page JSON-LD <script> (structuredData.ts). Re-parsed here so invalid JSON fails the build. */
const jsonLdTag = (routeKey, lang) => {
  if (routeKey === NOT_FOUND_ROUTE_KEY) return '';
  const json = serializeJsonLd(buildJsonLd(routeKey, lang));
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed['@graph']) || parsed['@graph'].length === 0) {
    throw new Error(`Empty JSON-LD for ${routeKey} (${lang})`);
  }
  return `<script type="application/ld+json" data-jsonld>${json}</script>`;
};

// index.html is the template: the client build has already injected the script/style tags.
// Placeholders: <!--app-head--> (per-page head tags) and <!--app-html--> (rendered app).
const builtTemplate = await readFile(join(DIST, 'index.html'), 'utf8');
for (const marker of ['<html lang="en">', '<!--app-head-->', '<div id="root"><!--app-html--></div>']) {
  if (!builtTemplate.includes(marker)) throw new Error(`index.html template is missing ${marker}`);
}
// Vite appends the stylesheet after the entry script and its modulepreloads. Move it to the top of
// the head, before the per-page preloads, so the render-blocking CSS is discovered and requested first.
const stylesheetTags = builtTemplate.match(/[ \t]*<link rel="stylesheet"[^>]*>\r?\n?/g) ?? [];
const template = stylesheetTags
  .reduce((html, tag) => html.replace(tag, ''), builtTemplate)
  .replace('<!--app-head-->', () => [...stylesheetTags.map((tag) => tag.trim()), '<!--app-head-->'].join('\n  '));

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));

/**
 * modulepreload tags for the page's chunk (unless eagerly bundled, like Home) and the text table of
 * its language (utils/i18n/<lang>.ts, loaded by index.tsx before hydrating), plus their static
 * imports, minus what the template already links.
 */
const modulePreloads = (page, lang) => {
  const files = new Set();
  const visit = (key) => {
    const chunk = manifest[key];
    if (!chunk || files.has(chunk.file)) return;
    files.add(chunk.file);
    for (const imported of chunk.imports ?? []) visit(imported);
  };
  const pageEntry = manifest[`pages/${page}.tsx`];
  if (pageEntry && !pageEntry.isEntry) visit(`pages/${page}.tsx`);
  const tableKey = `utils/i18n/${lang}.ts`;
  if (!manifest[tableKey]) throw new Error(`No chunk for ${tableKey} in the client build manifest`);
  visit(tableKey);
  return [...files]
    .filter((file) => !template.includes(`/${file}"`))
    .map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`)
    .join('\n  ');
};

const writeDist = async (relativeFile, contents) => {
  const target = join(DIST, ...relativeFile.split('/'));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
};

/** Content photos of a prerendered page (<img src> inside <main>), for the sitemap's image entries. */
const pageImages = new Map();
const contentImages = (appHtml) => {
  const main = appHtml.slice(appHtml.indexOf('<main id="main"'), appHtml.indexOf('</main>'));
  // Decorative images (alt="" or aria-hidden) are not content and do not belong in the image sitemap.
  return [...main.matchAll(/<img\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => !/\salt=""|\saria-hidden="true"/i.test(tag))
    .map((tag) => tag.match(/\ssrc="(\/[^"]+\.(?:jpe?g|png|webp|avif))"/i)?.[1])
    .filter(Boolean);
};

/**
 * GitHub Pages serves the one dist/404.html (English) for every unknown URL, also under /bg/. So it
 * also carries the other languages' 404 markup in inert <template>s, and a tiny inline script swaps the
 * right one in before the first paint; index.tsx then hydrates it (data-lang matches) instead of
 * replacing the English page once JS has loaded.
 */
const notFoundVariants = async (page) => {
  const variants = [];
  for (const lang of LANGUAGES) {
    if (lang === page.lang) continue;
    const prefix = localizePath('', lang);
    const table = manifest[`utils/i18n/${lang}.ts`];
    if (!prefix || !table) throw new Error(`Cannot build the ${lang} variant of 404.html`);
    variants.push({ lang, prefix, table: `/${table.file}`, title: NOT_FOUND_META[lang].title, html: await render(localizePath(page.url, lang)) });
  }
  if (variants.length === 0) return '';
  const script = `(function () {
    var variants = ${JSON.stringify(variants.map(({ lang, prefix, table, title }) => ({ lang, prefix, table, title })))};
    var path = location.pathname;
    for (var i = 0; i < variants.length; i++) {
      var v = variants[i];
      if (path !== v.prefix && path.indexOf(v.prefix + '/') !== 0) continue;
      var template = document.getElementById('not-found-' + v.lang);
      var root = document.getElementById('root');
      if (!template || !root) return;
      root.innerHTML = template.innerHTML;
      root.setAttribute('data-lang', v.lang);
      document.documentElement.lang = v.lang;
      document.title = v.title;
      var link = document.createElement('link');
      link.rel = 'modulepreload';
      link.crossOrigin = '';
      link.href = v.table;
      document.head.appendChild(link);
      return;
    }
  })();`.replace(/<\//g, '<\\/');
  return [
    ...variants.map((v) => `<template id="not-found-${v.lang}">${v.html}</template>`),
    `<script>${script}</script>`,
  ].join('\n  ');
};

const pages = getPrerenderPages();
for (const page of pages) {
  const appHtml = await render(page.url);
  // Content must be in the HTML as visible markup, not in a hidden out-of-line Suspense segment
  // revealed by script (see progressiveChunkSize in entry-server.tsx).
  if (/<div hidden id="S:|\$RC\(|<template id="B:/.test(appHtml)) {
    throw new Error(`${page.url}: prerendered content was streamed out of line (hidden until JS runs)`);
  }
  if (!appHtml.includes('<main id="main"')) throw new Error(`${page.url}: prerendered HTML has no <main>`);
  pageImages.set(`${page.routeKey}:${page.lang}`, contentImages(appHtml));
  const head = [renderHeadTags(page.head), modulePreloads(page.page, page.lang), jsonLdTag(page.routeKey, page.lang)]
    .filter(Boolean)
    .join('\n  ');
  const afterRoot = page.routeKey === NOT_FOUND_ROUTE_KEY ? await notFoundVariants(page) : '';
  const html = template
    .replace('<html lang="en">', `<html lang="${page.lang}">`)
    .replace('<!--app-head-->', () => head)
    .replace(
      '<div id="root"><!--app-html--></div>',
      () =>
        `<div id="root" data-route="${page.routeKey}" data-lang="${page.lang}">${appHtml}</div>` +
        (afterRoot ? `\n  ${afterRoot}` : ''),
    );
  await writeDist(page.file, html);
  console.log(`prerendered ${page.url.padEnd(14)} -> dist/${page.file} (${(html.length / 1024).toFixed(1)} kB)`);
}

// <lastmod> per URL: the later of the page's dated content (litters, FAQ, privacy policy) and the
// last commit that touched its sources. Falls back to the build date when git is unavailable or the
// sources have uncommitted changes, so a changed page is never reported as older than it is.
// (CI checks out the full history, see .github/workflows/deploy.yml.)
const BUILD_DATE = process.env.BUILD_DATE ?? new Date().toISOString().slice(0, 10);
const EXTRA_SOURCES = { faq: ['utils/faq.ts'], privacy: ['utils/privacyPolicy.ts'] };
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const sourceDate = (files) => {
  try {
    if (git(['status', '--porcelain', '--', ...files])) return BUILD_DATE;
    return git(['log', '-1', '--format=%cs', '--', ...files]) || BUILD_DATE;
  } catch {
    return BUILD_DATE;
  }
};
const lastmods = new Map();
for (const route of getSitemapRoutes()) {
  for (const lang of LANGUAGES) {
    const files = [`pages/${route.page}.tsx`, `utils/i18n/${lang}.ts`, 'constants.ts', 'routes.ts', ...(EXTRA_SOURCES[route.id] ?? [])];
    const dates = [sourceDate(files), getDateModified(route.id)].filter(Boolean).sort();
    lastmods.set(`${route.id}:${lang}`, dates[dates.length - 1]);
  }
}
await writeDist(
  'sitemap.xml',
  buildSitemap(
    (id, lang) => lastmods.get(`${id}:${lang}`) ?? BUILD_DATE,
    (id, lang) => pageImages.get(`${id}:${lang}`) ?? [],
  ),
);
console.log(`wrote dist/sitemap.xml (lastmod ${[...lastmods].map(([key, date]) => `${key}=${date}`).join(', ')})`);

// Plain-Markdown fact sheets for AI tools (https://llmstxt.org), built from the same data as the pages.
await writeDist('llms.txt', buildLlmsTxt());
await writeDist('llms-full.txt', buildLlmsFullTxt());
console.log('wrote dist/llms.txt and dist/llms-full.txt');

const stubs = buildLegacyStubs();
for (const stub of stubs) await writeDist(stub.file, stub.html);
console.log(`wrote ${stubs.length} legacy redirect stubs (${stubs.map((s) => s.file).join(', ')})`);

// Build metadata only; not part of the site.
await rm(join(DIST, '.vite'), { recursive: true, force: true });
