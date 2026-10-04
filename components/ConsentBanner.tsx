import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { OPEN_CONSENT_EVENT, getConsent, setConsent, type ConsentChoice } from '../utils/analytics';

// Both choices share one style so neither is visually favoured.
const buttonClass =
  'flex-1 sm:flex-none sm:min-w-[9rem] bg-stella-blue hover:bg-stella-dark text-white font-bold py-3 px-6 uppercase tracking-widest text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stella-gold focus-visible:ring-offset-2';

/**
 * Cookie consent banner for the Google Ads tag (see utils/analytics.ts).
 * Rendered only after mount, so prerendered HTML and hydration never include it. Fixed to
 * the bottom of the viewport as an overlay: it never pushes page content (no layout shift).
 * Shown until the visitor chooses; reopened from the footer's "Cookie settings".
 */
const ConsentBanner: React.FC = () => {
  const { t, path } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reopened, setReopened] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (getConsent() === null) setOpen(true);
    const onOpen = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setReopened(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  // Opened on request (not on page load): move focus into the banner so keyboard and
  // screen-reader users land on it.
  useEffect(() => {
    if (open && reopened) headingRef.current?.focus();
  }, [open, reopened]);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setOpen(false);
    if (reopened) returnFocusRef.current?.focus();
    setReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t('consent.label')}
      aria-describedby="consent-description"
      className="fixed inset-x-0 bottom-0 z-[1100] p-3 sm:p-6 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-3xl mx-auto bg-white border border-stella-sand shadow-2xl p-5 sm:p-6">
        <h2 ref={headingRef} tabIndex={-1} className="font-serif text-xl text-stella-dark mb-2 focus:outline-none">
          {t('consent.title')}
        </h2>
        <p id="consent-description" className="text-sm text-gray-600 leading-relaxed">
          {t('consent.desc')}{' '}
          <Link to={path('privacy')} className="text-stella-blue underline underline-offset-2 hover:text-stella-gold-dark">
            {t('consent.privacy_link')}
          </Link>
        </p>
        <div className="mt-4 flex gap-3 sm:justify-end">
          <button type="button" onClick={() => choose('denied')} className={buttonClass}>
            {t('consent.reject')}
          </button>
          <button type="button" onClick={() => choose('granted')} className={buttonClass}>
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
