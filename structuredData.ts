/**
 * Build-time only: JSON-LD structured data for each prerendered page and the /llms.txt and
 * /llms-full.txt fact sheets. Imported by entry-server.tsx (the SSR bundle) and used by
 * scripts/prerender.mjs; never by the browser bundle, so the FAQ text stays out of it.
 *
 * Everything is derived from the same data the pages render (constants.ts, utils/i18n/*.ts,
 * utils/faq.ts), so the structured data cannot drift from the visible content. Keep it honest:
 * no street address, coordinates, prices or reviews that the site itself does not show.
 */
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  DOGS,
  FAQ_UPDATED,
  KENNEL,
  LITTERS,
  LITTERS_UPDATED,
  PRIVACY_UPDATED,
  PUPPY_HOMES,
  SITE_NAME,
  SOCIAL_FACEBOOK,
  SOCIAL_INSTAGRAM,
} from './constants';
import { LANGUAGES, OG_IMAGE, ROUTES, SITE_URL, absoluteUrl, getRoute, routePath, type Language, type RouteDef, type RouteId } from './routes';
import { translate } from './context/LanguageContext';
import { getFaq } from './utils/faq';
import { BUILD_DATE, fill, formatDate, formatMonth, getLastHomedLitter, getUpcomingLitter, weeksBetween } from './utils/litters';
import type { Dog, HealthResult } from './types';

type JsonObject = Record<string, unknown>;

const KENNEL_ID = `${SITE_URL}/#kennel`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/images/logo.png`;
const PWD_WIKIPEDIA = 'https://en.wikipedia.org/wiki/Portuguese_Water_Dog';

/** 'OUR STORY' → 'Our story', 'ЗА НАС' → 'За нас' (nav labels are upper case for styling only). */
const sentenceCase = (label: string): string =>
  label.length <= 3 ? label : label.charAt(0) + label.slice(1).toLowerCase(); // keep 'FAQ' as is

const pageLabel = (route: RouteDef, lang: Language): string =>
  route.navKey ? sentenceCase(translate(lang, route.navKey)) : route.meta[lang].title.split(' | ')[0];

/** The kennel itself; the same node on every page (referenced by @id elsewhere). */
const kennelNode = (lang: Language): JsonObject => ({
  // A home-based breeder that people contact and visit by appointment: a LocalBusiness,
  // but not a store, so no opening hours, price range or street address are claimed.
  '@type': 'LocalBusiness',
  '@id': KENNEL_ID,
  name: SITE_NAME,
  alternateName: ['Stella Maris', KENNEL.nameBg, `Развъдник ${KENNEL.nameBg}`, 'Stella Maris Portuguese Water Dog Kennel'],
  description: translate(lang, 'footer.description'),
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
  image: OG_IMAGE.url,
  telephone: CONTACT_PHONE.replace(/\s/g, ''),
  email: CONTACT_EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: lang === 'bg' ? 'София' : 'Sofia', addressCountry: 'BG' },
  areaServed: [
    { '@type': 'Country', name: lang === 'bg' ? 'България' : 'Bulgaria' },
    { '@type': 'Place', name: lang === 'bg' ? 'Европа' : 'Europe' },
  ],
  founder: KENNEL.founders.map((name) => ({ '@type': 'Person', name })),
  knowsAbout: { '@type': 'Thing', name: 'Portuguese Water Dog', sameAs: PWD_WIKIPEDIA },
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'FCI registered kennel number',
    value: KENNEL.registrationNumber,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: CONTACT_PHONE.replace(/\s/g, ''),
    email: CONTACT_EMAIL,
    availableLanguage: ['en', 'bg'],
    // Phone hours (Sofia local time), as shown on the contact page. Visits are by appointment.
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  },
  sameAs: [SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM],
  subjectOf: KENNEL.press.map((article) => ({
    '@type': 'NewsArticle',
    headline: article.headline,
    url: article.url,
    datePublished: article.datePublished,
    inLanguage: article.inLanguage,
    publisher: { '@type': 'Organization', name: article.publisher, url: 'https://agrotv.bg/' },
  })),
});

const websiteNode = (): JsonObject => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  alternateName: KENNEL.nameBg,
  inLanguage: [...LANGUAGES],
  publisher: { '@id': KENNEL_ID },
});

const PAGE_TYPES: Partial<Record<RouteId, string>> = {
  about: 'AboutPage',
  contact: 'ContactPage',
  faq: 'FAQPage',
};

const DATE_MODIFIED: Partial<Record<RouteId, string>> = {
  puppies: LITTERS_UPDATED,
  faq: FAQ_UPDATED,
  privacy: PRIVACY_UPDATED,
};

/** Date of the page's dated content (litters, FAQ, privacy policy), if it has one. Also used for the sitemap. */
export const getDateModified = (routeId: RouteId): string | undefined => DATE_MODIFIED[routeId];

/** JSON-LD (@graph) for one prerendered page. */
export const buildJsonLd = (routeId: RouteId, lang: Language): JsonObject => {
  const route: RouteDef = getRoute(routeId);
  const url = absoluteUrl(routePath(routeId, lang));
  const isHome = routeId === 'home';

  const page: JsonObject = {
    '@type': PAGE_TYPES[routeId] ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: route.meta[lang].title,
    description: route.meta[lang].description,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': KENNEL_ID },
  };
  if (DATE_MODIFIED[routeId]) page.dateModified = DATE_MODIFIED[routeId];

  const graph: JsonObject[] = [kennelNode(lang), websiteNode(), page];

  if (!isHome) {
    page.breadcrumb = { '@id': `${url}#breadcrumb` };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: pageLabel(getRoute('home'), lang), item: absoluteUrl(routePath('home', lang)) },
        { '@type': 'ListItem', position: 2, name: pageLabel(route, lang), item: url },
      ],
    });
  }

  if (routeId === 'faq') {
    // The FAQ page itself is the FAQPage; its questions are exactly the ones shown on the page.
    page.mainEntity = getFaq(lang, BUILD_DATE).flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer.join('\n\n') },
      })),
    );
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};

/** Serialize for a <script type="application/ld+json"> (no "</script>" can appear inside). */
export const serializeJsonLd = (data: JsonObject): string => JSON.stringify(data).replace(/</g, '\\u003c');

// ---------------------------------------------------------------------------
// llms.txt / llms-full.txt (https://llmstxt.org): plain Markdown for AI tools and agents.
// ---------------------------------------------------------------------------

const t = (key: string) => translate('en', key);

const healthLine = (dog: Dog, r: HealthResult): string => {
  const name = t(`health.tests.${r.test}.name`);
  const status = r.status === 'graded' ? `${t('health.status.graded')} ${r.value ?? ''}`.trim() : t(`health.status.${r.status}`);
  const value = r.status !== 'graded' && r.value ? ` (${r.value})` : '';
  const about = t(`health.tests.${r.test}.about`);
  return `  - ${name}: ${status}${value}${about ? ` – ${about}` : ''}`;
};

const pageLinks = (lang: Language): string[] =>
  ROUTES.map((route: RouteDef) => `- [${pageLabel(route, lang)}](${absoluteUrl(routePath(route.id as RouteId, lang))}): ${route.meta[lang].description}`);

const keyFacts = (): string[] => {
  const upcoming = getUpcomingLitter(BUILD_DATE);
  const last = getLastHomedLitter();
  return [
    '- Breed: Portuguese Water Dog (Cão de Água Português, FCI standard No. 37)',
    '- Location: Sofia, Bulgaria. Visits by appointment only.',
    `- Run by: ${KENNEL.founders.join(' and ')}, a family in Sofia; the dogs live in the family home.`,
    `- Registration: FCI registered kennel No. ${KENNEL.registrationNumber}`,
    `- Names: Stella Maris Kennel; in Bulgarian "${KENNEL.nameBg}" / "Развъдник ${KENNEL.nameBg}"`,
    `- Breeding dogs: ${DOGS.map((d) => `${t(`dogs.profiles.${d.id}.name`)} (${d.registeredName}, ${d.gender === 'Male' ? 'sire' : 'dam'})`).join('; ')}`,
    upcoming
      ? `- Next litter: expected ${formatMonth(upcoming.expectedMonth, 'en')}; waitlist open`
      : '- Next litter: none planned at the moment; waitlist open',
    last
      ? `- Last litter: born ${formatDate(last.whelpDate, 'en')} (${last.puppiesCount} puppies), went home from ${formatDate(last.goHomeDate, 'en')} at about ${weeksBetween(last.whelpDate, last.goHomeDate)} weeks`
      : '',
    `- Contact: ${CONTACT_EMAIL} (current email address), phone/WhatsApp ${CONTACT_PHONE}, ${t('contact.hours')}`,
    '- How to inquire: the contact form at https://stellamaris.dog/contact/ (choose "Puppy waitlist"), email or WhatsApp',
    '- Languages: English, Bulgarian',
    ...KENNEL.press.map((p) => `- Press: ${p.publisher}, ${formatDate(p.datePublished, 'en')}: ${p.url}`),
  ].filter(Boolean);
};

export const buildLlmsTxt = (): string =>
  [
    `# ${SITE_NAME}`,
    '',
    `> Family Portuguese Water Dog kennel in Sofia, Bulgaria, run by ${KENNEL.founders.join(' and ')}. FCI registered kennel No. ${KENNEL.registrationNumber}. Bulgarian name: ${KENNEL.nameBg}.`,
    '',
    `Last updated: ${BUILD_DATE}`,
    '',
    '## Key facts',
    ...keyFacts(),
    '',
    '## Pages (English)',
    ...pageLinks('en'),
    '',
    '## Pages (Bulgarian)',
    ...pageLinks('bg'),
    '',
    '## Optional',
    `- [Full fact sheet](${SITE_URL}/llms-full.txt): dogs, show titles, health test results, litters and the full FAQ in English and Bulgarian`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    '',
  ].join('\n');

export const buildLlmsFullTxt = (): string => {
  const out: string[] = [
    `# ${SITE_NAME} – full fact sheet`,
    '',
    `> ${t('footer.description')}`,
    '',
    `Last updated: ${BUILD_DATE}. Litter information checked ${LITTERS_UPDATED}; FAQ reviewed ${FAQ_UPDATED}.`,
    '',
    '## Key facts',
    ...keyFacts(),
    '',
    '## About us',
    t('about.story_p1'),
    '',
    t('about.journey'),
    '',
    t('about.name_meaning'),
    '',
    t('about.press_text'),
    '',
    '## Our dogs',
  ];

  for (const dog of DOGS) {
    const prizes = translate('en', `dogs.profiles.${dog.id}.prizes`) as unknown as string[];
    out.push(
      '',
      `### ${t(`dogs.profiles.${dog.id}.name`)} – ${dog.registeredName} (${dog.gender === 'Male' ? 'sire' : 'dam'})`,
      `Page: ${absoluteUrl(routePath('dogs', 'en'))}#${dog.id}`,
      '',
      t(`dogs.profiles.${dog.id}.description`),
      '',
      'Show titles and results:',
      ...(Array.isArray(prizes) ? prizes.map((p) => `  - ${p}`) : []),
      '',
      'Health test results:',
      ...dog.healthResults.map((r) => healthLine(dog, r)),
    );
  }

  const carrier = DOGS.find((d) => d.healthResults.some((r) => r.test === 'prcd_pra' && r.status === 'carrier'));
  const clear = DOGS.find((d) => d !== carrier && d.healthResults.some((r) => r.test === 'prcd_pra' && r.status === 'clear'));
  if (carrier && clear && carrier.gender !== clear.gender) {
    out.push(
      '',
      fill(t('health.carrier_note'), {
        carrier: t(`dogs.profiles.${carrier.id}.name`),
        clear: t(`dogs.profiles.${clear.id}.name`),
        test: 'prcd-PRA',
      }),
    );
  }

  out.push('', '## Litters', '');
  for (const litter of LITTERS) {
    out.push(
      `- ${t(`puppies.litters.${litter.translationKey}.name`)} (${litter.sire} x ${litter.dam}): born ${formatDate(litter.whelpDate, 'en')}, ${litter.puppiesCount} puppies, went home from ${formatDate(litter.goHomeDate, 'en')}. ${t(`puppies.litters.${litter.translationKey}.description`)}`,
    );
  }
  const upcoming = getUpcomingLitter(BUILD_DATE);
  if (upcoming) out.push(`- Next litter: expected ${formatMonth(upcoming.expectedMonth, 'en')}.`);
  out.push(
    '',
    `Some of the places where our puppies live today: ${PUPPY_HOMES.map((h) => `${t(`puppies.locations.${h.countryKey}`)} (${h.count})`).join(', ')}. This is not a complete list.`,
    '',
    `## ${t('puppies.process.title')}`,
    '',
  );
  const last = getLastHomedLitter();
  (translate('en', 'puppies.process.steps') as unknown as { title: string; text: string }[]).forEach((step, i, steps) => {
    if (i === steps.length - 1 && !last) return;
    const text = last
      ? fill(step.text, { date: formatDate(last.goHomeDate, 'en'), weeks: weeksBetween(last.whelpDate, last.goHomeDate) })
      : step.text;
    out.push(`${i + 1}. ${step.title}: ${text}`);
  });
  out.push('', t('puppies.process.terms'));

  for (const lang of LANGUAGES) {
    out.push('', `## ${lang === 'en' ? 'FAQ (English)' : 'Чести въпроси (Bulgarian)'}`, `Page: ${absoluteUrl(routePath('faq', lang))}`);
    for (const section of getFaq(lang, BUILD_DATE)) {
      out.push('', `### ${section.title}`);
      for (const item of section.items) {
        out.push('', `**${item.question}**`, '', ...item.answer.flatMap((p, i) => (i ? ['', p] : [p])));
      }
    }
  }

  out.push(
    '',
    '## Contact',
    `- Email: ${CONTACT_EMAIL} (current email address)`,
    `- Phone and WhatsApp: ${CONTACT_PHONE} (${t('contact.hours')})`,
    `- Contact form: ${absoluteUrl(routePath('contact', 'en'))}`,
    `- Facebook: ${SOCIAL_FACEBOOK}`,
    `- Instagram: ${SOCIAL_INSTAGRAM}`,
    '',
  );
  return out.join('\n');
};
