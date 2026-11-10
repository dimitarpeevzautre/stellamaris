import { beforeAll, describe, expect, it } from 'vitest';
import { LANGUAGES, ROUTES, type RouteId } from '../routes';
import { buildJsonLd, buildLlmsFullTxt, buildLlmsTxt, serializeJsonLd } from '../structuredData';
import { registerTranslations } from '../utils/translations';
import en from '../utils/i18n/en';
import bg from '../utils/i18n/bg';

beforeAll(() => {
  // As in entry-server.tsx: the prerender has both text tables loaded.
  registerTranslations('en', en);
  registerTranslations('bg', bg);
});

const graph = (id: RouteId) => buildJsonLd(id, 'en')['@graph'] as Record<string, unknown>[];

describe('buildJsonLd', () => {
  it('builds a valid schema.org graph for every page in every language', () => {
    for (const route of ROUTES) {
      for (const lang of LANGUAGES) {
        const data = buildJsonLd(route.id, lang);
        expect(data['@context']).toBe('https://schema.org');
        const json = serializeJsonLd(data);
        expect(json).not.toContain('<');
        expect(JSON.parse(json)).toEqual(data);
      }
    }
  });

  it('adds breadcrumbs to sub-pages and the questions to the FAQ page', () => {
    expect(graph('home').some((n) => n['@type'] === 'BreadcrumbList')).toBe(false);
    expect(graph('dogs').some((n) => n['@type'] === 'BreadcrumbList')).toBe(true);
    const faqPage = graph('faq').find((n) => Array.isArray(n.mainEntity));
    expect((faqPage?.mainEntity as unknown[]).length).toBeGreaterThan(0);
  });

  it('escapes < so the JSON cannot close its script tag', () => {
    expect(serializeJsonLd({ text: '</script>' })).toBe('{"text":"\\u003c/script>"}');
  });
});

describe('llms.txt', () => {
  it('links every page', () => {
    const txt = buildLlmsTxt();
    for (const route of ROUTES) expect(txt).toContain(`https://stellamaris.dog${route.path}`);
    expect(buildLlmsFullTxt().length).toBeGreaterThan(txt.length);
  });
});
