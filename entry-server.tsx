/**
 * SSR entry used only at build time (vite build --ssr) by scripts/prerender.mjs.
 * Never shipped to the browser.
 */
import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { registerTranslations } from './utils/translations';
import en from './utils/i18n/en';
import bg from './utils/i18n/bg';

// The prerender renders every language, so both text tables are bundled and available synchronously.
registerTranslations('en', en);
registerTranslations('bg', bg);

export { getPrerenderPages, getSitemapRoutes, renderHeadTags, buildSitemap, buildLegacyStubs, NOT_FOUND_ROUTE_KEY } from './seo';
export { LANGUAGES, NOT_FOUND_META, localizePath } from './routes';
export { buildJsonLd, getDateModified, serializeJsonLd, buildLlmsTxt, buildLlmsFullTxt } from './structuredData';

/** Render the app at `url` to HTML, waiting for every lazy page to resolve. */
export const render = async (url: string): Promise<string> => {
  const errors: unknown[] = [];
  const { prelude } = await prerenderToNodeStream(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
    {
      // Without this, React moves any Suspense boundary larger than ~12.8 kB out of line:
      // the page content would ship inside <div hidden> behind the loading spinner and only
      // appear after an inline script runs, so crawlers without JS would see no content.
      progressiveChunkSize: Number.POSITIVE_INFINITY,
      // Errors inside a Suspense boundary would silently become client-only
      // fallbacks; fail the build instead so every page ships real HTML.
      onError(error) {
        errors.push(error);
      },
    },
  );
  const chunks: Buffer[] = [];
  for await (const chunk of prelude) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  if (errors.length > 0) throw errors[0];
  return Buffer.concat(chunks).toString('utf8');
};
