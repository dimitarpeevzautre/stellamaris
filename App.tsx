import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import DocumentHead from './components/DocumentHead';
import ErrorBoundary, { RootErrorBoundary } from './components/ErrorBoundary';
import ConsentBanner from './components/ConsentBanner';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LANGUAGES, ROUTES, localizePath, routePath, type Language } from './routes';
import { getPreferredLanguage } from './utils/languagePreference';
import { trackPageView } from './utils/analytics';

type PageModule = { default: React.ComponentType };

// The home page is the main landing page, so it ships in the entry chunk (no extra
// request before first render). Every other page in pages/ is code-split.
const eagerPages = import.meta.glob<PageModule>('./pages/Home.tsx', { eager: true });
const lazyPages = import.meta.glob<PageModule>(['./pages/*.tsx', '!./pages/Home.tsx']);

// One import promise per page chunk, shared by React.lazy and preloadPage(); dropped on failure so a
// later attempt can retry.
const pageLoads = new Map<string, Promise<PageModule>>();
const loadPage = (file: string): Promise<PageModule> => {
  let promise = pageLoads.get(file);
  if (!promise) {
    const load = lazyPages[file];
    if (!load) return Promise.reject(new Error(`Missing page component ${file}`));
    promise = load().then((module) => {
      // Vite resolves a failed chunk import with undefined when the vite:preloadError handler
      // (index.tsx) calls preventDefault() to reload the page: treat that as a failure too.
      if (!module?.default) throw new Error(`Failed to fetch dynamically imported module ${file}`);
      return module;
    });
    promise.catch(() => pageLoads.delete(file));
    pageLoads.set(file, promise);
  }
  return promise;
};

const pageComponent = (page: string): React.ComponentType => {
  const file = `./pages/${page}.tsx`;
  const eager = eagerPages[file];
  if (eager) return eager.default;
  if (!lazyPages[file]) throw new Error(`Missing page component ${file}`);
  return lazy(() => loadPage(file));
};

/**
 * Download a page's code before hydrating its prerendered HTML (index.tsx). If this fails, index.tsx
 * leaves the readable static page in place instead of letting the error boundary replace it.
 */
export const preloadPage = async (page: string): Promise<void> => {
  const file = `./pages/${page}.tsx`;
  if (!eagerPages[file]) await loadPage(file);
};

const ROUTE_ELEMENTS = ROUTES.map((route) => {
  const Page = pageComponent(route.page);
  return { route, element: <Page /> };
});
const NotFound = pageComponent('NotFound');

/** Language-neutral path: /bg/about/ and /about/ are the same page. */
const stripLanguage = (pathname: string, language: Language) =>
  pathname.slice(localizePath('', language).length) || '/';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const page = stripLanguage(pathname, language);
  const previousPage = useRef(page);
  // Switching language keeps the scroll position; moving to another page scrolls to the top.
  // Skipped on first mount so hydrating a prerendered page doesn't undo the visitor's scrolling.
  useEffect(() => {
    if (previousPage.current === page) return;
    previousPage.current = page;
    window.scrollTo(0, 0);
    // Move focus to the new page's content so keyboard and screen-reader users start there
    // (and screen readers announce the page change). <main> has tabIndex={-1} for this.
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [page]);
  return null;
};

/**
 * On the first load of the English home page, send visitors who chose Bulgarian
 * before (or whose browser prefers Bulgarian) to /bg/. Runs only in the browser,
 * after hydration, so the prerendered HTML stays the same for crawlers.
 */
const LanguageRedirect = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const checked = useRef(false);
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    if (pathname !== routePath('home', 'en')) return;
    const preferred = getPreferredLanguage();
    if (preferred && preferred !== 'en') navigate(routePath('home', preferred), { replace: true });
  }, [pathname, navigate]);
  return null;
};

/** Page views for client-side navigation (sent only with cookie consent, see utils/analytics.ts). */
const PageViewTracker = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    trackPageView(pathname + search);
  }, [pathname, search]);
  return null;
};

// Full height, so the footer is never painted inside the viewport while a page chunk loads.
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-stella-cream">
    <Loader2 className="animate-spin text-stella-gold" size={32} />
  </div>
);

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      {/* Skip link: the first focusable element, visible only when focused by keyboard. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1200] focus:bg-stella-blue focus:text-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:shadow-lg"
      >
        {t('nav.skip_to_content')}
      </a>
      <DocumentHead />
      <ScrollToTop />
      <LanguageRedirect />
      <PageViewTracker />
      <Navigation />

      <ErrorBoundary language={language} resetKey={pathname}>
        {/* Footer is inside the boundary so it only appears together with the page content. */}
        <Suspense fallback={<PageFallback />}>
          <main id="main" tabIndex={-1} className="flex-grow focus:outline-none">
            <Routes>
              {LANGUAGES.flatMap((lang) =>
                ROUTE_ELEMENTS.map(({ route, element }) => (
                  <Route key={`${lang}:${route.id}`} path={routePath(route.id, lang)} element={element} />
                )),
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Suspense>
      </ErrorBoundary>
      <ConsentBanner />
    </div>
  );
};

/** Root component. Render inside a router: BrowserRouter in the browser, StaticRouter when prerendering. */
const App: React.FC = () => (
  <RootErrorBoundary>
    <LanguageProvider>
      <AppLayout />
    </LanguageProvider>
  </RootErrorBoundary>
);

export default App;
