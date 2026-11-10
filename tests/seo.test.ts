import { describe, expect, it } from 'vitest';
import { LANGUAGES, ROUTES, isIndexable } from '../routes';
import { buildLegacyStubs, buildSitemap, escapeHtml, getHeadData, getPrerenderPages, renderHeadTags } from '../seo';

describe('getHeadData', () => {
  it('gives indexable pages a canonical URL and hreflang alternates', () => {
    const head = getHeadData('/bg/about/');
    expect(head.lang).toBe('bg');
    expect(head.canonical).toBe('https://stellamaris.dog/bg/about/');
    expect(head.robots).toBe('index, follow');
    expect(head.alternates.map((a) => a.hreflang)).toEqual([...LANGUAGES, 'x-default']);
  });

  it('marks unknown paths noindex without a canonical', () => {
    const head = getHeadData('/missing/');
    expect(head.robots).toBe('noindex, follow');
    expect(head.canonical).toBeUndefined();
    expect(head.alternates).toEqual([]);
  });
});

describe('renderHeadTags', () => {
  it('escapes text placed in tags and attributes', () => {
    expect(escapeHtml('a & "b" <c>')).toBe('a &amp; &quot;b&quot; &lt;c&gt;');
    const html = renderHeadTags({ ...getHeadData('/'), title: 'X "<y>"' });
    expect(html).toContain('<title>X &quot;&lt;y&gt;&quot;</title>');
    expect(html).toContain('<link rel="canonical" href="https://stellamaris.dog/" />');
  });
});

describe('getPrerenderPages', () => {
  it('lists every route in every language plus 404.html, each file once', () => {
    const pages = getPrerenderPages();
    const files = pages.map((p) => p.file);
    expect(pages).toHaveLength(ROUTES.length * LANGUAGES.length + 1);
    expect(new Set(files).size).toBe(files.length);
    expect(files).toContain('404.html');
    expect(files).toContain('bg/dogs/index.html');
    for (const file of files) expect(file).toMatch(/(^|\/)(index|404)\.html$/);
  });
});

describe('buildSitemap', () => {
  it('contains every indexable page in every language, each image once', () => {
    const xml = buildSitemap(
      () => '2026-01-01',
      (id) => (id === 'dogs' ? ['/images/a.jpg', '/images/a.jpg'] : []),
    );
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toHaveLength(ROUTES.filter(isIndexable).length * LANGUAGES.length);
    expect(locs).toContain('https://stellamaris.dog/bg/puppies/');
    expect(xml.match(/<image:loc>https:\/\/stellamaris\.dog\/images\/a\.jpg<\/image:loc>/g)).toHaveLength(
      LANGUAGES.length,
    );
  });
});

describe('buildLegacyStubs', () => {
  it('points old pages at their new paths without overwriting real routes', () => {
    const stubs = buildLegacyStubs();
    const files = stubs.map((s) => s.file);
    expect(new Set(files).size).toBe(files.length);
    expect(files).not.toContain('bg/index.html');
    const puppies = stubs.find((s) => s.file === 'bg/puppies.html');
    expect(puppies?.html).toContain('url=/bg/puppies/');
    expect(puppies?.html).toContain('noindex');
  });
});
