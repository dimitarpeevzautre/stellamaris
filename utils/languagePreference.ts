import { LANGUAGES, type Language } from '../routes';

const STORAGE_KEY = 'stella-maris-language';

/** The language the visitor explicitly chose with the switcher, if any. Browser only. */
export const getStoredLanguage = (): Language | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(value as Language) ? (value as Language) : null;
  } catch {
    return null;
  }
};

export const storeLanguage = (lang: Language): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage unavailable (private mode, blocked cookies): the choice just isn't remembered.
  }
};

/**
 * Language to send a visitor to when they land on the English home page:
 * their remembered choice, else Bulgarian if the browser prefers it. Browser only.
 */
export const getPreferredLanguage = (): Language | null => {
  const stored = getStoredLanguage();
  if (stored) return stored;
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return browserLanguages[0]?.toLowerCase().startsWith('bg') ? 'bg' : null;
};
