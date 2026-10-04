/**
 * Loader for the UI text tables. The text itself lives in utils/i18n/en.ts and utils/i18n/bg.ts
 * (keep both in step: bg.ts is typed as `Translations`, so a missing key fails the type check).
 *
 * Each table is a separate chunk, so a visitor downloads only the language of the page:
 *  - in the browser, index.tsx awaits loadTranslations(<page language>) before hydrating, and the
 *    other table is fetched when the visitor switches language (or prefetched on idle/hover);
 *  - the SSR bundle (entry-server.tsx) imports and registers both tables up front.
 */
import type { Language } from '../routes';
import type { Translations } from './i18n/en';

export type { Translations };

const tables: Partial<Record<Language, Translations>> = {};
const pending: Partial<Record<Language, Promise<Translations>>> = {};

const LOADERS: Record<Language, () => Promise<{ default: Translations }>> = {
  en: () => import('./i18n/en'),
  bg: () => import('./i18n/bg'),
};

/** Make a table available synchronously (used by the SSR entry, which bundles both). */
export const registerTranslations = (lang: Language, table: Translations): void => {
  tables[lang] = table;
};

/** The table for `lang` if it has been loaded, else undefined. */
export const getLoadedTranslations = (lang: Language): Translations | undefined => tables[lang];

/** Load the table for `lang` once; every caller gets the same promise (as React's use() requires). */
export const loadTranslations = (lang: Language): Promise<Translations> => {
  const ready = tables[lang];
  if (ready) return Promise.resolve(ready);
  let promise = pending[lang];
  if (!promise) {
    promise = LOADERS[lang]()
      .then((module) => {
        // Vite resolves a failed chunk import with undefined when the vite:preloadError handler
        // (index.tsx) calls preventDefault() to reload the page: treat that as a failure too.
        if (!module?.default) throw new Error(`The "${lang}" text table could not be loaded`);
        return (tables[lang] = module.default);
      })
      .catch((error: unknown) => {
        delete pending[lang]; // allow a retry, e.g. on the next language switch
        throw error;
      });
    pending[lang] = promise;
  }
  return promise;
};

const forRender: Partial<Record<Language, Promise<Translations>>> = {};

/**
 * For LanguageProvider's use(): like loadTranslations(), but never rejects, so a network error never
 * unmounts the app. If the table cannot be downloaded (e.g. after a client-side language switch while
 * offline or on a flaky connection), the browser loads the current URL itself instead: every page is
 * prerendered, and index.tsx leaves that static HTML in place when its text table fails to load.
 * The returned promise then stays pending, so React keeps the current screen until the reload.
 */
export const loadTranslationsForRender = (lang: Language): Promise<Translations> => {
  let promise = forRender[lang];
  if (!promise) {
    promise = loadTranslations(lang).catch((error: unknown) => {
      console.error(error);
      if (typeof window !== 'undefined') window.location.reload();
      return new Promise<Translations>(() => {});
    });
    forRender[lang] = promise;
  }
  return promise;
};

/** Fetch a table in the background (e.g. the other language, before the visitor switches). */
export const prefetchTranslations = (lang: Language): void => {
  loadTranslations(lang).catch(() => {
    /* a real language switch retries and reports the error */
  });
};

/** The loaded table for `lang`. Throws if it is not loaded: call it only after loadTranslations(). */
export const getTranslations = (lang: Language): Translations => {
  const table = tables[lang];
  if (!table) throw new Error(`Translations for "${lang}" are not loaded`);
  return table;
};
