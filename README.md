# Stella Maris Kennel

Website of Stella Maris Kennel, a Portuguese Water Dog breeder in Sofia, Bulgaria: <https://stellamaris.dog>.

React 19 + TypeScript, built with Vite and Tailwind CSS (PostCSS). The site is bilingual: English at `/`, Bulgarian at `/bg/`. Every page is prerendered to static HTML at build time and deployed to GitHub Pages.

## Commands

```sh
npm install         # install dependencies (CI uses npm ci)
npm run dev         # dev server on http://localhost:3000 (client-side rendering only)
npm run typecheck   # tsc --noEmit
npm run build       # full production build into dist/ (see below)
npm run preview     # serve dist/ locally
```

There are no tests or linters. Run `npm run typecheck` and `npm run build` before pushing.

## How the build works

`npm run build` runs, in order:

1. `prebuild`: `scripts/encode-images.mjs` turns the originals in `assets-src/images/` into responsive WebP variants, JPEG fallbacks and the 1200x630 `og-image.jpg` in `public/images/` (plus `utils/imageManifest.ts`); `scripts/generate-icons.mjs` renders the favicon/app icons from `public/favicon.svg`. Only changed images are re-encoded.
2. `vite build`: the browser bundle in `dist/`.
3. `vite build --ssr entry-server.tsx`: a Node bundle in `dist-ssr/` (never deployed).
4. `scripts/prerender.mjs`: renders every route in both languages into `dist/<path>/index.html` with its own title, description, canonical, hreflang and Open Graph tags. It also writes `dist/404.html`, `dist/sitemap.xml`, and redirect stubs for URLs of the previous site (`puppies.html`, `story.html`, `/es/` …).

In the browser, React hydrates the prerendered HTML.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml` (Node 22: `npm ci` → typecheck → build). It publishes `dist/` to GitHub Pages. The custom domain is set in `public/CNAME`. You can also start the workflow by hand from the Actions tab.

## Common changes

- **Text:** every user-facing string is in `utils/i18n/en.ts` and `utils/i18n/bg.ts` (same keys in both; `npm run typecheck` fails if Bulgarian misses one).
- **Dogs, litters, available puppies:** edit `constants.ts`. Put original photos in `assets-src/images/` (never in `public/images/`, which is generated), run `npm run encode:images`, and reference them as `/images/<name>.jpg` with a translated alt-text key (`Photo` in `types.ts`). Dog names, descriptions and titles are translated in `utils/i18n/en.ts` and `utils/i18n/bg.ts` under `dogs.profiles.<dog id>`, litter names/descriptions under `puppies.litters.<translationKey>`, health tests under `health.tests.<key>`.
- **Next litter / freshness:** add or remove an entry in `PLANNED_LITTERS` (the banner, Puppies page, FAQ, JSON-LD and llms.txt follow and hide it once its month has passed). Bump `LITTERS_UPDATED` / `FAQ_UPDATED` in `constants.ts` when you change litters or the FAQ (`utils/faq.ts`).
- **Structured data and llms.txt:** generated at build time by `structuredData.ts` (per-page JSON-LD; `/llms.txt`, `/llms-full.txt`) from the same data. Only add facts the site itself shows.
- **Add a page:** create `pages/MyPage.tsx` (default export), then add one entry to `ROUTES` in `routes.ts`. That entry needs `id`, `path` (with a trailing slash), `page: 'MyPage'`, a `meta` title and description for each language, and `navKey` if the page belongs in the main menu. The router, the `/bg/` version, prerendering, sitemap, hreflang and navigation all come from that entry. Link to pages with `const { path } = useLanguage(); <Link to={path('my-id')}>` so links keep the current language.
