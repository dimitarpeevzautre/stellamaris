import React from 'react';
import './index.css';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App, { preloadPage } from './App';
import { DEFAULT_LANGUAGE, legacyHashToPath, matchPath, type Language } from './routes';
import { NOT_FOUND_PAGE, NOT_FOUND_ROUTE_KEY } from './seo';
import { reloadOnceForStaleChunk } from './utils/staleChunkReload';
import { initAnalytics } from './utils/analytics';
import { loadTranslations, prefetchTranslations } from './utils/translations';
import { getPreferredLanguage } from './utils/languagePreference';

// A deploy replaced the hashed chunks this tab expects: reload once to get the new ones.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForStaleChunk()) event.preventDefault();
});

type MatchedRoute = ReturnType<typeof matchPath>['route'];

/**
 * True when #root holds the prerendered markup for this exact page and language
 * (404.html is served for every unknown URL, in English).
 */
const hasPrerenderedPage = (rootElement: HTMLElement, lang: Language, route: MatchedRoute) =>
  rootElement.firstElementChild !== null &&
  rootElement.dataset.route === (route ? route.id : NOT_FOUND_ROUTE_KEY) &&
  rootElement.dataset.lang === lang;

const mount = (lang: Language, route: MatchedRoute) => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  // Hydrate only when the prerendered markup is for this exact page and language.
  if (hasPrerenderedPage(rootElement, lang, route)) {
    hydrateRoot(rootElement, app);
  } else {
    rootElement.replaceChildren();
    createRoot(rootElement).render(app);
  }
};

// Links from the old HashRouter site (/#/puppies) move to their real paths.
const legacyTarget = legacyHashToPath(window.location.hash);
if (legacyTarget) {
  window.location.replace(legacyTarget);
} else {
  // /index.html and /about/index.html are the same pages as / and /about/: show the clean URL.
  if (window.location.pathname.endsWith('/index.html')) {
    const { pathname, search, hash } = window.location;
    window.history.replaceState(window.history.state, '', pathname.slice(0, -'index.html'.length) + search + hash);
  }
  // Consent-gated Google Ads tag (loads only after an "accept") + contact-link click tracking.
  initAnalytics();
  const { lang, route } = matchPath(window.location.pathname);
  // Only this page's language is downloaded (each text table is its own chunk); it must be
  // loaded before hydrating so the first render matches the prerendered HTML.
  // A visitor who will be sent to their preferred language (App.tsx, LanguageRedirect) needs that text too.
  const preferred = route?.id === 'home' && lang === DEFAULT_LANGUAGE ? getPreferredLanguage() : null;
  if (preferred && preferred !== lang) prefetchTranslations(preferred);
  // Over prerendered HTML the page's own code chunk is loaded first too: if it fails, the static page
  // stays readable instead of being replaced by the error screen during hydration. (Without
  // prerendered HTML there is nothing to keep, so the app mounts and its error boundary handles it.)
  const root = document.getElementById('root');
  const pageReady =
    root && hasPrerenderedPage(root, lang, route) ? preloadPage(route ? route.page : NOT_FOUND_PAGE) : Promise.resolve();
  Promise.all([loadTranslations(lang), pageReady]).then(
    () => mount(lang, route),
    (error: unknown) => {
      // Without its text or code the app cannot render this page. Don't mount: the prerendered HTML
      // stays in place and stays readable and navigable without JS (text, images, plain links). If a stale
      // chunk triggered a reload (vite:preloadError above), the new page is already on its way.
      console.error(error);
      const rootElement = document.getElementById('root');
      if (rootElement && !rootElement.firstElementChild) {
        rootElement.textContent =
          'This page could not be loaded. Please reload it. / Страницата не можа да се зареди. Моля, презаредете я.';
      }
    },
  );
  // The other language is fetched only when needed: on hover/focus of the language switch (Navigation.tsx).
}
