# CLAUDE.md

## Project Overview

Stella Maris Kennel — a bilingual (English/Bulgarian) website for a Portuguese Water Dog breeder in Sofia, Bulgaria. Built as a React application whose routes are prerendered to static HTML at build time (then hydrated in the browser) and deployed to GitHub Pages at https://stellamaris.dog.

## Tech Stack

- **Language:** TypeScript (~5.8)
- **Framework:** React 19 with React Router DOM 7 (BrowserRouter in the browser, StaticRouter for prerendering)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3, compiled via PostCSS (`tailwind.config.js`, `postcss.config.js`, `index.css`)
- **Icons:** Lucide React
- **Maps:** Leaflet
- **Contact form:** Formspree

## Project Structure

```
├── components/       # Reusable UI components (Navigation, Footer, ImageCarousel, Picture, ErrorBoundary, DocumentHead, ConsentBanner)
├── pages/            # Route-level page components (Home, About, OurDogs, Puppies, FAQ, Contact, Privacy, NotFound)
├── context/          # React context providers (LanguageContext: language derived from the URL)
├── utils/            # Translations, FAQ text (faq.ts), date/litter helpers (litters.ts, useToday.ts), privacy policy text, consent + Google Ads measurement (analytics.ts), language preference, stale-chunk reload helper
├── assets-src/images/ # Original photos (NOT deployed); source for scripts/encode-images.mjs
├── scripts/          # encode-images.mjs + generate-icons.mjs (prebuild), prerender.mjs (post-build static HTML)
├── public/           # Deployed as-is: generated images/, icons, favicon.svg, site.webmanifest, CNAME, robots.txt
├── routes.ts         # Route table: paths, page components, nav labels, per-language title/description, legacy URLs
├── seo.ts            # Head tags, sitemap and legacy redirect stubs derived from routes.ts
├── App.tsx           # Root component: layout, routes (both languages), Suspense, error boundary
├── index.tsx         # Browser entry: old #/ link redirect, hydrateRoot/createRoot
├── entry-server.tsx  # Build-time SSR entry (prerenderToNodeStream + StaticRouter)
├── constants.ts      # Hardcoded data (kennel facts, dogs + health results, litters, planned litters, puppy homes, contact details)
├── structuredData.ts # Build-time JSON-LD per page + /llms.txt and /llms-full.txt (SSR bundle only)
├── types.ts          # TypeScript interfaces (Dog, Litter, AvailablePuppy)
├── vite.config.ts    # Vite configuration (vendor chunk, manifest, SSR output dir)
└── tsconfig.json     # TypeScript configuration
```

## Commands

```sh
npm install           # Install dependencies
npm run dev           # Start dev server (port 3000, host 0.0.0.0; client-side rendering only)
npm run typecheck     # tsc --noEmit
npm run build         # encode images → client build → SSR build (dist-ssr/) → prerender into /dist
npm run preview       # Preview production build
```

There are **no test or lint commands** configured. Verify changes with `npm run typecheck` and `npm run build`.

## Build & Deploy

- CI/CD via GitHub Actions (`.github/workflows/deploy.yml`)
- Pushes to `main` (or a manual `workflow_dispatch`) trigger build + deploy to GitHub Pages
- Build: Node.js 22 → `npm ci` → `npm run typecheck` → `npm run build` → upload `/dist`
- `npm run build` prerenders every route in both languages to `dist/<path>/index.html` and also writes `dist/404.html`, `dist/sitemap.xml` (generated — there is no static sitemap) and noindex redirect stubs for old Jekyll-site URLs (`puppies.html`, `story.html`, `bg/*.html`, `es/` …)

## Key Conventions

### Components
- Functional components typed with `React.FC`
- PascalCase filenames and component names
- camelCase for functions/variables, CONSTANT_CASE for exported constants

### Styling
- Tailwind utility classes throughout
- Custom color palette: `stella-blue` (#1e3a8a), `stella-gold` (#d4af37), `stella-cream` (#f9f7f2), `stella-sand` (#e5ddd0), `stella-dark` (#2c2c2c)
- Contrast: `stella-gold` is only ~2:1 on cream/white, so use it for fills, decoration and text on dark backgrounds. For gold text, labels, active nav and hover colours on light backgrounds use `stella-gold-dark` (#86691a, 4.8:1 on cream). Body and meta text is `gray-500` or darker, never `gray-400`.
- Accessibility: `index.css` gives every `:focus-visible` a stella-blue outline (add `on-dark` to dark sections for a white one). Don't add `outline-none` without a visible replacement. Form fields need a `<label htmlFor>`/`id` pair, and Contact validates in the page language (`noValidate`, `aria-invalid`, `aria-describedby`). There's a skip link to `#main`. Escape closes the mobile menu. Carousel arrows stay visible on touch screens, and the slide position is announced.
- Responsive design using Tailwind breakpoints (sm, md, lg)

### Internationalization
- Custom context-based i18n via `LanguageContext`
- Two locales: `en` (English, at `/`) and `bg` (Bulgarian, at `/bg/`). The language comes from the URL, never from state, so prerendered HTML and the hydrated client match
- The EN/BG switcher links to the same page in the other language and stores the choice in localStorage; on the first load of `/`, a stored or browser preference for Bulgarian redirects to `/bg/` (client-side only)
- Use `useLanguage()` → `t(key)` for strings and `path(routeId, search?)` for internal links (language-aware, trailing slash)
- All UI strings live in `utils/i18n/en.ts` and `utils/i18n/bg.ts` (one chunk per language, loaded by `utils/translations.ts`; `bg.ts` is typed from `en.ts`, so a missing key fails `tsc`) using dot-notation keys (e.g., `nav.home`, `home.hero_title`)
- When adding new user-facing text, add translations for both languages

### Routing
- BrowserRouter with real paths and trailing slashes: `/`, `/about/`, `/dogs/`, `/puppies/`, `/faq/`, `/contact/`, `/privacy/` (footer only, no nav entry), plus the same under `/bg/`; anything else renders `pages/NotFound.tsx` (noindex)
- `routes.ts` is the single route table. Adding a page = `pages/<Page>.tsx` + one `ROUTES` entry (path, page, navKey, per-language meta); router, prerender, sitemap, hreflang, head tags and nav follow automatically
- `Home` is bundled eagerly; other pages are lazy-loaded via `import.meta.glob` in `App.tsx`
- Old `/#/path` links are redirected to `/path/` in `index.tsx`
- Rendering must stay deterministic for hydration: no `window`/`localStorage`/`navigator` reads during render — use effects (Leaflet is imported inside an effect)

### Data
- No database — all content is hardcoded: data in `constants.ts`, text in `utils/i18n/{en,bg}.ts` (dog bios/titles keyed by dog id under `dogs.profiles`), FAQ in `utils/faq.ts`
- Facts must be sourced (owner data, the AGRO TV article in `KENNEL.press`, cited breed/EU sources in `utils/faq.ts`); never invent titles, results, dates, prices or terms
- Time-based content uses `useToday()` (starts at the build date `__BUILD_DATE__` so hydration matches, then the real date): the next-litter banner hides itself after `PLANNED_LITTERS[].expectedMonth`
- Photos: originals live in `assets-src/images/`; `public/images/` holds only generated files (do not edit or add files there by hand). Reference an image by its public JPEG URL (e.g. `/images/arthy.jpg`) and render it with `components/Picture.tsx` (srcset/sizes, width/height, lazy by default; pass `loading="eager"` + `fetchPriority="high"` only for a page's LCP image). Galleries are `Photo[]` (`{ src, altKey }`) so each alt text (translated, describing what the photo shows) stays tied to its file

### Path Aliases
- `@/*` maps to the project root (configured in both `vite.config.ts` and `tsconfig.json`)

## Notes

- `index.html` is the prerender template: `<!--app-head-->` receives per-page head tags, `<!--app-html-->` the rendered app; shared tags (og:type, referrer policy, the Consent Mode default) stay in the template; JSON-LD is added per page by the prerender from `structuredData.ts` and removed by `DocumentHead` after client-side navigation
- Google Ads (gtag.js, `AW-17854194557`) follows Consent Mode v2 "basic": `index.html` only defines the `gtag` stub with everything denied; `utils/analytics.ts` injects gtag.js after the visitor accepts in `ConsentBanner` (or, for a stored accept, after window load when idle). Never add the gtag.js `<script src>` back to `index.html`. Use `trackEvent`/`trackLead` (no-ops without consent); tel:/mailto:/WhatsApp clicks are tracked by one delegated listener. Conversion labels go in `CONVERSION_LABELS`
- The privacy policy (`pages/Privacy.tsx`) text lives in `utils/privacyPolicy.ts` (kept out of the main bundle); update it, and its date (`PRIVACY_UPDATED` in `constants.ts`), whenever data handling changes (new third-party service, form fields, cookies)
- Contact form (Formspree): `_gotcha` honeypot, `subject` line, hidden `language`/`litter`/`puppy` fields and `source_page`; `?interest=waitlist`, `?litter=<litter id>` and `&puppy=<puppy id>` preselect the form
- Tailwind CSS is bundled through PostCSS; icons come from `lucide-react` (no CDN scripts)
- `prebuild` runs `scripts/encode-images.mjs` (for each photo in `assets-src/images/`: `<name>.webp` up to 1600px, `<name>-480/-960.webp`, a `<name>.jpg` fallback ≤1200px, plus `og-image.jpg` 1200x630; writes `utils/imageManifest.ts`, removes stale outputs; per-image crop/blur options at the top of the script) and `scripts/generate-icons.mjs` (favicon.ico, apple-touch-icon, manifest icons and `images/logo.png` from `public/favicon.svg`). Both skip up-to-date files; commit their outputs. `--force` re-encodes
- `ImageCarousel` keeps every slide in the DOM (crawlable) but only displays the current one; its neighbours are lazy-loaded invisibly so the next photo is ready. The frame has a fixed aspect ratio (no layout shift)
- The Puppies map loads Leaflet only when it nears the viewport, shows the OpenStreetMap attribution (required by its licence), and on phones starts with dragging off ("tap to move") so swipes scroll the page
- No testing framework or linter is configured — run `npm run typecheck` (vite build only strips types) and `npm run build`
