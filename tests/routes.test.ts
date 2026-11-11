import { describe, expect, it } from 'vitest';
import { LANGUAGES, ROUTES, legacyHashToPath, matchPath, routePath, switchLanguagePath } from '../routes';

describe('route table', () => {
  it('has unique ids and paths, each with a leading and trailing slash', () => {
    expect(new Set(ROUTES.map((r) => r.id)).size).toBe(ROUTES.length);
    expect(new Set(ROUTES.map((r) => r.path)).size).toBe(ROUTES.length);
    for (const route of ROUTES) expect(route.path).toMatch(/^\/(.*\/)?$/);
  });

  it('has a title and description for every language', () => {
    for (const route of ROUTES) {
      for (const lang of LANGUAGES) {
        expect(route.meta[lang].title.trim()).not.toBe('');
        expect(route.meta[lang].description.trim()).not.toBe('');
      }
    }
  });
});

describe('matchPath', () => {
  it('resolves language and route', () => {
    expect(matchPath('/')).toMatchObject({ lang: 'en', route: { id: 'home' } });
    expect(matchPath('/bg/')).toMatchObject({ lang: 'bg', route: { id: 'home' } });
    expect(matchPath('/bg')).toMatchObject({ lang: 'bg', route: { id: 'home' } });
    expect(matchPath('/bg/dogs/')).toMatchObject({ lang: 'bg', route: { id: 'dogs' } });
  });

  it('accepts a missing trailing slash and index.html', () => {
    expect(matchPath('/about').route?.id).toBe('about');
    expect(matchPath('/about/index.html').route?.id).toBe('about');
    expect(matchPath('/index.html').route?.id).toBe('home');
  });

  it('returns no route for unknown paths', () => {
    expect(matchPath('/nope/').route).toBeNull();
    expect(matchPath('/bg/nope/')).toMatchObject({ lang: 'bg', route: null });
    expect(matchPath('/bgx/').route).toBeNull();
  });

  it('round-trips every route in every language', () => {
    for (const route of ROUTES) {
      for (const lang of LANGUAGES) {
        expect(matchPath(routePath(route.id, lang))).toMatchObject({ lang, route: { id: route.id } });
      }
    }
  });
});

describe('language switcher and legacy links', () => {
  it('switches to the same page in the other language', () => {
    expect(switchLanguagePath('/puppies/', 'bg')).toBe('/bg/puppies/');
    expect(switchLanguagePath('/bg/faq/', 'en')).toBe('/faq/');
    expect(switchLanguagePath('/unknown/', 'bg')).toBe('/bg/');
  });

  it('maps old #/ links to real paths, keeping the query', () => {
    expect(legacyHashToPath('#/puppies?interest=waitlist')).toBe('/puppies/?interest=waitlist');
    expect(legacyHashToPath('#/bg/contact')).toBe('/bg/contact/');
    expect(legacyHashToPath('#/gone')).toBe('/');
    expect(legacyHashToPath('#main')).toBeNull();
  });
});
