import React, { createContext, use, useCallback, useContext, useMemo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getLoadedTranslations, loadTranslationsForRender, type Translations } from '../utils/translations';
import { matchPath, routePath, switchLanguagePath, type Language, type RouteId } from '../routes';

export type { Language };

interface LanguageContextType {
    /** Current language, derived from the URL (/bg/... is Bulgarian). */
    language: Language;
    /** Id of the current route, or null on the 404 page. */
    routeId: RouteId | null;
    t: (key: string) => string;
    /** Language-aware path to a route, e.g. path('contact', '?interest=waitlist'). */
    path: (id: RouteId, search?: string) => string;
    /** The current page in another language (that language's home on the 404 page). */
    alternatePath: (lang: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const lookup = (table: Translations | undefined, key: string): string => {
    let value: any = table;
    for (const k of key.split('.')) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return key; // Return key if translation not found
        }
    }
    return value as string;
};

/** Translate outside React (structured data, error boundary). Returns the key if the table is not loaded. */
export const translate = (language: Language, key: string): string => lookup(getLoadedTranslations(language), key);

/** Must be rendered inside a router: the language comes from the URL, so server and client agree. */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { pathname } = useLocation();
    const { lang: language, route } = matchPath(pathname);
    const routeId = route ? route.id : null;

    // The page's own table is loaded before the first render (index.tsx, entry-server.tsx).
    // After a language switch the other table may still be on its way: React Router navigates in a
    // transition, so suspending here keeps the current page on screen until the text has arrived.
    // The promise never rejects (a failed download reloads the prerendered page instead), so this
    // provider, which sits above every error boundary, cannot unmount the app.
    const table = getLoadedTranslations(language) ?? use(loadTranslationsForRender(language));

    const t = useCallback((key: string) => lookup(table, key), [table]);
    const path = useCallback((id: RouteId, search = '') => `${routePath(id, language)}${search}`, [language]);
    const alternatePath = useCallback((lang: Language) => switchLanguagePath(pathname, lang), [pathname]);

    const value = useMemo(
        () => ({ language, routeId, t, path, alternatePath }),
        [language, routeId, t, path, alternatePath],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
