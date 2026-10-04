/**
 * Cookie consent + Google Ads (gtag.js) measurement, following Google Consent Mode v2 "basic":
 *
 *  - index.html defines `dataLayer`/`gtag` inline and sets every consent type to 'denied'.
 *    It does NOT load gtag.js.
 *  - gtag.js is injected only after the visitor accepts in the consent banner (right away),
 *    or, if they accepted on an earlier visit, once the page has loaded and the browser is idle.
 *  - Visitors who reject (or haven't chosen yet) never download gtag.js and get no ad cookies.
 *
 * Every tracking helper is a no-op on the server, without consent, or when gtag is missing.
 * Browser storage is wrapped in try/catch: private modes and blocked storage just mean the
 * choice isn't remembered.
 */

/** Google Ads account tag. */
export const ADS_ID = 'AW-17854194557';

/**
 * Google Ads conversion labels ("AW-…/<label>" send_to values). Empty until conversion actions
 * are created in Google Ads (Goals → Conversions → Website, "use Google tag events / manual
 * setup"); paste the label part after the slash. While empty, only the generic
 * `generate_lead` / `contact_click` events are sent.
 */
export const CONVERSION_LABELS: { readonly lead: string; readonly contactClick: string } = {
  lead: '',
  contactClick: '',
};

export type ConsentChoice = 'granted' | 'denied';

const CONSENT_KEY = 'stella-maris-consent';
/** Ask again after about a year, in line with common EU regulator guidance. */
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
/** Window event the footer's "Cookie settings" link fires to reopen the banner. */
export const OPEN_CONSENT_EVENT = 'stella-maris:open-consent';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const isBrowser = typeof window !== 'undefined';

/** The stub defined inline in index.html (queues calls in dataLayer until gtag.js loads). */
const gtag: Gtag = (...args) => {
  if (!isBrowser) return;
  if (typeof window.gtag !== 'function') {
    // Should not happen (index.html defines it), but keep the queue semantics if it does.
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // gtag.js requires the Arguments object itself, not an array.
      window.dataLayer!.push(arguments);
    };
  }
  window.gtag(...args);
};

// ---------------------------------------------------------------------------
// Consent storage
// ---------------------------------------------------------------------------

/** The visitor's stored, unexpired choice, or null if they haven't chosen. Browser only. */
export const getConsent = (): ConsentChoice | null => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { choice?: unknown; at?: unknown };
    if (parsed.choice !== 'granted' && parsed.choice !== 'denied') return null;
    if (typeof parsed.at !== 'number' || Date.now() - parsed.at > CONSENT_MAX_AGE_MS) return null;
    return parsed.choice;
  } catch {
    return null;
  }
};

const storeConsent = (choice: ConsentChoice) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch {
    // Storage unavailable: the choice applies to this page view only.
  }
};

const consentState = (choice: ConsentChoice) => ({
  ad_storage: choice,
  ad_user_data: choice,
  ad_personalization: choice,
  analytics_storage: choice,
});

/** Remove Google Ads first-party cookies (_gcl_au etc.) after consent is withdrawn. */
const clearAdCookies = () => {
  const host = window.location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (!name || !name.startsWith('_gcl')) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
};

// ---------------------------------------------------------------------------
// gtag.js loading
// ---------------------------------------------------------------------------

let gtagLoaded = false;
/** Choice made on this page view; wins over storage (which may be unavailable). */
let sessionChoice: ConsentChoice | null = null;

const hasConsent = () => (sessionChoice ?? getConsent()) === 'granted';

/** Inject gtag.js and configure the Ads tag. Idempotent. Only call with consent. */
const loadGtag = () => {
  if (!isBrowser || gtagLoaded) return;
  gtagLoaded = true;
  gtag('js', new Date());
  // The config call sends the page_view for the page open right now (the Google tag sends
  // one even with send_page_view: false, so an explicit one here would double count).
  // Later client-side navigations: see MANUAL_SPA_PAGE_VIEWS.
  gtag('config', ADS_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  document.head.appendChild(script);
};

/** Load gtag.js after the window load event, when the browser is idle (off the critical path). */
const loadGtagWhenIdle = () => {
  const idle = (fn: () => void) => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 4000 });
    else setTimeout(fn, 1500);
  };
  const run = () => idle(() => {
    if (hasConsent()) loadGtag();
  });
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
};

/** Record the visitor's choice from the banner and apply it immediately. */
export const setConsent = (choice: ConsentChoice): void => {
  if (!isBrowser) return;
  sessionChoice = choice;
  storeConsent(choice);
  gtag('consent', 'update', consentState(choice));
  if (choice === 'granted') {
    loadGtag();
    return;
  }
  clearAdCookies();
  // Consent withdrawn while gtag.js is running on this page: even with consent 'denied' it
  // keeps sending cookieless pings (tested: a page_view on the next navigation, and the
  // ga-disable-<id> flag does not stop it). Reload so the page runs without the tag.
  if (gtagLoaded) window.location.reload();
};

/** Reopen the consent banner (footer "Cookie settings"). */
export const openConsentSettings = (): void => {
  if (isBrowser) window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
};

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

/** Send a gtag event to the Ads tag. No-op without consent. */
export const trackEvent = (name: string, params: Record<string, unknown> = {}): void => {
  if (!isBrowser || !hasConsent()) return;
  // Consent given earlier but gtag.js still waiting for idle time: load it now so the
  // config is queued before this event.
  loadGtag();
  gtag('event', name, { send_to: ADS_ID, ...params });
};

const sendConversion = (label: string) => {
  if (label) trackEvent('conversion', { send_to: `${ADS_ID}/${label}` });
};

const pageLanguage = () => document.documentElement.lang || 'en';

let currentPath: string | null = null;
let previousPath: string | null = null;

/** The in-site page the visitor was on before the current one (null on the landing page). */
export const getPreviousPath = (): string | null => previousPath;

/**
 * Whether to send a page_view ourselves on client-side navigation. Off because the Ads tag
 * already does it: its "page changes based on browser history events" setting is on, and
 * testing showed it sends a page_view for every pushState (an explicit event doubled every
 * navigation). Turn this on only if that setting is switched off in the Google tag settings.
 */
const MANUAL_SPA_PAGE_VIEWS = false;

const sendPageView = () => {
  if (!MANUAL_SPA_PAGE_VIEWS || !gtagLoaded || !hasConsent()) return;
  gtag('event', 'page_view', {
    send_to: ADS_ID,
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    language: pageLanguage(),
  });
};

/**
 * Call on every client-side navigation (including the first render).
 * Records the in-site referrer for the contact form. Page views themselves come from the
 * Google tag (config call for the landing page, history-change detection afterwards), see
 * MANUAL_SPA_PAGE_VIEWS. Nothing is sent without consent because gtag.js isn't loaded.
 */
export const trackPageView = (path: string): void => {
  if (!isBrowser || path === currentPath) return;
  previousPath = currentPath;
  currentPath = path;
  // Let DocumentHead update document.title first.
  setTimeout(sendPageView, 0);
};

export type ContactMethod = 'phone' | 'whatsapp' | 'email';

/** A visitor clicked a tel:, WhatsApp or mailto: link. */
export const trackContactClick = (method: ContactMethod): void => {
  trackEvent('contact_click', { method, language: pageLanguage(), page_path: window.location.pathname });
  sendConversion(CONVERSION_LABELS.contactClick);
};

/** The contact form was submitted successfully. */
export const trackLead = (params: { interest: string; language: string; litter?: string }): void => {
  trackEvent('generate_lead', { method: 'contact_form', ...params });
  sendConversion(CONVERSION_LABELS.lead);
};

const contactMethodForHref = (href: string): ContactMethod | null => {
  if (href.startsWith('tel:')) return 'phone';
  if (href.startsWith('mailto:')) return 'email';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'whatsapp';
  return null;
};

let initialized = false;

/**
 * Browser start-up (index.tsx): apply a stored "accept" and schedule gtag.js, and track
 * clicks on every tel:/mailto:/WhatsApp link on the site through one delegated listener.
 */
export const initAnalytics = (): void => {
  if (!isBrowser || initialized) return;
  initialized = true;

  if (hasConsent()) {
    gtag('consent', 'update', consentState('granted'));
    loadGtagWhenIdle();
  }

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element | null;
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      const method = contactMethodForHref(link.getAttribute('href') ?? '');
      if (method) trackContactClick(method);
    },
    { capture: true },
  );
};
