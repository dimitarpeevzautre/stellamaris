/**
 * Date formatting and litter helpers shared by the pages, the structured data and /llms.txt.
 * Pure functions (no React/DOM), so they give the same result on the server and in the browser.
 */
import { LITTERS, PLANNED_LITTERS } from '../constants';
import type { Litter, PlannedLitter } from '../types';
import type { Language } from '../routes';

/**
 * The day the site was built (YYYY-MM-DD). The prerendered HTML is generated with this date,
 * so the first client render must use it too (see useToday) to hydrate without mismatches.
 */
export const BUILD_DATE: string =
  typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10);

const LOCALES: Record<Language, string> = { en: 'en-GB', bg: 'bg-BG' };

/** Parse 'YYYY-MM-DD' or 'YYYY-MM' as a UTC date (no time-zone drift between server and browser). */
const parseIsoDate = (iso: string): Date => new Date(`${iso.length === 7 ? `${iso}-01` : iso}T00:00:00Z`);

/** '2025-12-25' → '25 December 2025' / '25 декември 2025 г.' */
export const formatDate = (iso: string, lang: Language): string =>
  new Intl.DateTimeFormat(LOCALES[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    parseIsoDate(iso),
  );

/** '2027-01' or '2027-01-15' → 'January 2027' / 'януари 2027 г.' */
export const formatMonth = (iso: string, lang: Language): string =>
  new Intl.DateTimeFormat(LOCALES[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parseIsoDate(iso));

/** Whole weeks between two ISO dates (e.g. a litter's birth and go-home dates). */
export const weeksBetween = (fromIso: string, toIso: string): number =>
  Math.floor((parseIsoDate(toIso).getTime() - parseIsoDate(fromIso).getTime()) / (7 * 24 * 60 * 60 * 1000));

/**
 * The next planned litter whose expected month has not passed on `today` (YYYY-MM-DD),
 * or undefined. A litter expected in January stays announced until the end of January.
 */
export const getUpcomingLitter = (today: string): PlannedLitter | undefined =>
  [...PLANNED_LITTERS]
    .filter((litter) => litter.expectedMonth >= today.slice(0, 7))
    .sort((a, b) => a.expectedMonth.localeCompare(b.expectedMonth))[0];

/** The most recently born litter that has gone home (for "puppies go home at about N weeks"). */
export const getLastHomedLitter = (): Litter | undefined =>
  [...LITTERS]
    .filter((litter) => litter.status === 'Sold Out')
    .sort((a, b) => b.whelpDate.localeCompare(a.whelpDate))[0];

/**
 * Replace {name} placeholders in a translated string. A full stop right after a placeholder is
 * dropped when the value already ends in one, e.g. Bulgarian months end in 'г.' ('януари 2027 г.'),
 * so '…през {month}. Запишете…' does not become '…г.. Запишете…'.
 */
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}(\.?)/g, (match, key: string, stop: string) => {
    if (!(key in values)) return match;
    const value = String(values[key]);
    return stop && value.endsWith('.') ? value : value + stop;
  });
