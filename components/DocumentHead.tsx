import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getHeadData, type HeadData } from '../seo';

const setMeta = (attr: 'name' | 'property', key: string, content: string | null) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

const setCanonical = (href: string | undefined) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
};

const applyHead = (head: HeadData) => {
  document.documentElement.lang = head.lang;
  document.title = head.title; // updates the existing <title>, never adds a second one
  setMeta('name', 'description', head.description);
  setMeta('name', 'robots', head.robots);
  setCanonical(head.canonical);
  setMeta('property', 'og:url', head.canonical ?? null);
  setMeta('property', 'og:title', head.title);
  setMeta('property', 'og:description', head.description);
  setMeta('property', 'og:locale', head.ogLocale);
  setMeta('name', 'twitter:title', head.title);
  setMeta('name', 'twitter:description', head.description);
  // The share image is the same on every page; only its alt text follows the language.
  setMeta('property', 'og:image:alt', head.ogImage.alt);
  setMeta('name', 'twitter:image:alt', head.ogImage.alt);

  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((el) => el.remove());
  for (const locale of head.ogLocaleAlternates) {
    const el = document.createElement('meta');
    el.setAttribute('property', 'og:locale:alternate');
    el.content = locale;
    document.head.appendChild(el);
  }

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  for (const alt of head.alternates) {
    const el = document.createElement('link');
    el.rel = 'alternate';
    el.hreflang = alt.hreflang;
    el.href = alt.href;
    document.head.appendChild(el);
  }
};

/**
 * Keeps <html lang>, title, description, canonical, Open Graph and hreflang in
 * sync with the route on client-side navigation. Prerendered pages already ship
 * the same tags, so on first load this is a no-op in effect.
 */
const DocumentHead = () => {
  const { pathname } = useLocation();
  // Path the HTML was prerendered for; its JSON-LD (structuredData.ts) describes only that page.
  const landingPath = useRef(pathname);
  useEffect(() => {
    applyHead(getHeadData(pathname));
    // The structured data is built at build time only (to keep the FAQ text out of the
    // bundle), so after client-side navigation drop it rather than leave another page's.
    if (pathname !== landingPath.current) {
      document.head.querySelectorAll('script[type="application/ld+json"][data-jsonld]').forEach((el) => el.remove());
    }
  }, [pathname]);
  return null;
};

export default DocumentHead;
