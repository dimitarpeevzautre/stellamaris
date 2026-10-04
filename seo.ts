/**
 * Per-page <head> data, sitemap and legacy redirect stubs, all derived from the
 * route table in routes.ts. Pure functions only (no DOM): used by the client
 * head-sync hook and, through the SSR bundle, by scripts/prerender.mjs.
 */
import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  LEGACY_LANGUAGE_DIRS,
  LEGACY_PAGES,
  NOT_FOUND_META,
  OG_IMAGE,
  OG_LOCALE,
  ROUTES,
  absoluteUrl,
  isIndexable,
  matchPath,
  routePath,
  type Language,
  type PreloadImage,
  type RouteId,
} from './routes';
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME } from './constants';

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export interface HeadData {
  lang: Language;
  title: string;
  description: string;
  /** Absolute canonical URL; undefined for the 404 page. */
  canonical?: string;
  robots: string;
  ogLocale: string;
  ogLocaleAlternates: string[];
  alternates: HreflangLink[];
  preloadImages: readonly PreloadImage[];
  ogImage: { url: string; width: number; height: number; type: string; alt: string };
}

const ogImageFor = (lang: Language): HeadData['ogImage'] => ({
  url: OG_IMAGE.url,
  width: OG_IMAGE.width,
  height: OG_IMAGE.height,
  type: OG_IMAGE.type,
  alt: OG_IMAGE.alt[lang],
});

const hreflangLinks = (id: RouteId): HreflangLink[] => [
  ...LANGUAGES.map((lang) => ({ hreflang: lang, href: absoluteUrl(routePath(id, lang)) })),
  { hreflang: 'x-default', href: absoluteUrl(routePath(id, DEFAULT_LANGUAGE)) },
];

/** Head data for any pathname (unknown paths get the noindex 404 head). */
export const getHeadData = (pathname: string): HeadData => {
  const { lang, route } = matchPath(pathname);
  const ogLocaleAlternates = LANGUAGES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]);

  if (!route) {
    return {
      lang,
      ...NOT_FOUND_META[lang],
      robots: 'noindex, follow',
      ogLocale: OG_LOCALE[lang],
      ogLocaleAlternates,
      alternates: [],
      preloadImages: [],
      ogImage: ogImageFor(lang),
    };
  }

  const indexable = isIndexable(route);
  return {
    lang,
    ...route.meta[lang],
    canonical: absoluteUrl(routePath(route.id, lang)),
    robots: indexable ? 'index, follow' : 'noindex, follow',
    ogLocale: OG_LOCALE[lang],
    ogLocaleAlternates,
    alternates: indexable ? hreflangLinks(route.id) : [],
    preloadImages: 'preloadImages' in route ? route.preloadImages : [],
    ogImage: ogImageFor(lang),
  };
};

export const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Serialize head data to the tags injected into prerendered HTML. */
export const renderHeadTags = (head: HeadData): string => {
  const e = escapeHtml;
  const tags = [
    `<title>${e(head.title)}</title>`,
    `<meta name="description" content="${e(head.description)}" />`,
    `<meta name="robots" content="${e(head.robots)}" />`,
  ];
  if (head.canonical) {
    tags.push(`<link rel="canonical" href="${e(head.canonical)}" />`);
    tags.push(`<meta property="og:url" content="${e(head.canonical)}" />`);
  }
  for (const alt of head.alternates) {
    tags.push(`<link rel="alternate" hreflang="${e(alt.hreflang)}" href="${e(alt.href)}" />`);
  }
  tags.push(
    `<meta property="og:title" content="${e(head.title)}" />`,
    `<meta property="og:description" content="${e(head.description)}" />`,
    `<meta property="og:locale" content="${e(head.ogLocale)}" />`,
    ...head.ogLocaleAlternates.map((l) => `<meta property="og:locale:alternate" content="${e(l)}" />`),
    `<meta property="og:image" content="${e(head.ogImage.url)}" />`,
    `<meta property="og:image:type" content="${e(head.ogImage.type)}" />`,
    `<meta property="og:image:width" content="${head.ogImage.width}" />`,
    `<meta property="og:image:height" content="${head.ogImage.height}" />`,
    `<meta property="og:image:alt" content="${e(head.ogImage.alt)}" />`,
    `<meta name="twitter:title" content="${e(head.title)}" />`,
    `<meta name="twitter:description" content="${e(head.description)}" />`,
    `<meta name="twitter:image" content="${e(head.ogImage.url)}" />`,
    `<meta name="twitter:image:alt" content="${e(head.ogImage.alt)}" />`,
  );
  for (const img of head.preloadImages) {
    const responsive = img.srcset
      ? ` imagesrcset="${e(img.srcset)}"${img.sizes ? ` imagesizes="${e(img.sizes)}"` : ''}`
      : '';
    tags.push(
      `<link rel="preload" as="image" href="${e(img.href)}"${responsive} type="${e(img.type)}" fetchpriority="high" />`,
    );
  }
  return tags.join('\n  ');
};

export interface PrerenderPage {
  /** URL rendered by the router, e.g. '/bg/dogs/'. */
  url: string;
  /** Output file relative to dist/, with forward slashes, e.g. 'bg/dogs/index.html'. */
  file: string;
  /** Page component file name (pages/<page>.tsx), used to emit modulepreload hints. */
  page: string;
  /** Matches the data-route attribute the client checks before hydrating. */
  routeKey: string;
  lang: Language;
  head: HeadData;
}

export const NOT_FOUND_ROUTE_KEY = 'not-found';
export const NOT_FOUND_PAGE = 'NotFound';

/** Routes with their id and page component, for build scripts that work per page. */
export const getSitemapRoutes = (): { id: RouteId; page: string }[] =>
  ROUTES.filter((route) => isIndexable(route)).map((route) => ({ id: route.id, page: route.page }));

/** Every static HTML file to prerender: each route in each language, plus 404.html. */
export const getPrerenderPages = (): PrerenderPage[] => {
  const pages: PrerenderPage[] = [];
  for (const lang of LANGUAGES) {
    for (const route of ROUTES) {
      const url = routePath(route.id, lang);
      pages.push({
        url,
        file: `${url.slice(1)}index.html`,
        page: route.page,
        routeKey: route.id,
        lang,
        head: getHeadData(url),
      });
    }
  }
  // GitHub Pages serves dist/404.html (with a 404 status) for any unknown path.
  const notFoundUrl = '/404/';
  pages.push({
    url: notFoundUrl,
    file: '404.html',
    page: NOT_FOUND_PAGE,
    routeKey: NOT_FOUND_ROUTE_KEY,
    lang: DEFAULT_LANGUAGE,
    head: getHeadData(notFoundUrl),
  });
  return pages;
};

/**
 * sitemap.xml with every indexable page in every language and hreflang alternates.
 * `lastmodFor` gives each URL's last real content change (YYYY-MM-DD), see scripts/prerender.mjs.
 */
/**
 * sitemap.xml with every indexable page in both languages, its hreflang alternates and the photos
 * shown on it (Google image sitemap extension). `imagesFor` returns site-relative image paths
 * (scripts/prerender.mjs collects them from each prerendered page, so the list matches the HTML).
 */
export const buildSitemap = (
  lastmodFor: (id: RouteId, lang: Language) => string,
  imagesFor: (id: RouteId, lang: Language) => string[] = () => [],
): string => {
  const urls: string[] = [];
  for (const route of ROUTES) {
    if (!isIndexable(route)) continue;
    const alternates = hreflangLinks(route.id)
      .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeHtml(alt.href)}" />`)
      .join('\n');
    for (const lang of LANGUAGES) {
      urls.push(
        [
          '  <url>',
          `    <loc>${escapeHtml(absoluteUrl(routePath(route.id, lang)))}</loc>`,
          `    <lastmod>${lastmodFor(route.id, lang)}</lastmod>`,
          alternates,
          ...[...new Set(imagesFor(route.id, lang))].map(
            (src) => `    <image:image><image:loc>${escapeHtml(absoluteUrl(src))}</image:loc></image:image>`,
          ),
          '  </url>',
        ].join('\n'),
      );
    }
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
};

const STUB_TEXT: Record<Language, { title: string; moved: string; contact: string }> = {
  en: {
    title: 'This page has moved | Stella Maris',
    moved: 'This page has moved to',
    contact: `${SITE_NAME}, Sofia, Bulgaria – email ${CONTACT_EMAIL}, phone ${CONTACT_PHONE}.`,
  },
  bg: {
    title: 'Страницата е преместена | Стела Марис',
    moved: 'Тази страница е преместена на',
    contact: `Развъдник Стела Марис, София, България – имейл ${CONTACT_EMAIL}, тел. ${CONTACT_PHONE}.`,
  },
};

const redirectStubHtml = (lang: Language, targetPath: string): string => {
  const target = absoluteUrl(targetPath);
  const text = STUB_TEXT[lang];
  const e = escapeHtml;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${e(text.title)}</title>
  <meta name="robots" content="noindex" />
  <link rel="canonical" href="${e(target)}" />
  <meta http-equiv="refresh" content="0; url=${e(targetPath)}" />
  <script>location.replace(${JSON.stringify(targetPath)} + location.search + location.hash);</script>
</head>
<body style="font-family: system-ui, sans-serif; background: #f9f7f2; color: #2c2c2c; padding: 2rem; line-height: 1.6;">
  <p>${e(text.moved)} <a href="${e(targetPath)}" style="color: #1e3a8a;">${e(target)}</a></p>
  <p>${e(text.contact)}</p>
</body>
</html>
`;
};

/** Redirect stubs for URLs of the previous site, as { file (relative to dist/), html }. */
export const buildLegacyStubs = (): { file: string; html: string }[] => {
  const stubs: { file: string; html: string }[] = [];
  for (const [dir, lang] of Object.entries(LEGACY_LANGUAGE_DIRS)) {
    for (const [file, id] of Object.entries(LEGACY_PAGES)) {
      stubs.push({ file: `${dir}${file}`, html: redirectStubHtml(lang, routePath(id, lang)) });
    }
    // Old language home pages (e.g. /es/) that are not real routes any more.
    const isRealHome = LANGUAGES.some((l) => routePath('home', l) === `/${dir}`);
    if (dir && !isRealHome) {
      stubs.push({ file: `${dir}index.html`, html: redirectStubHtml(lang, routePath('home', lang)) });
    }
  }
  return stubs;
};
