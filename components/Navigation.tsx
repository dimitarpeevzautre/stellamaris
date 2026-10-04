import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, LANGUAGE_NAMES, ROUTES, type RouteDef, type RouteId } from '../routes';
import { storeLanguage } from '../utils/languagePreference';
import { prefetchTranslations } from '../utils/translations';
import { fill, formatMonth, getUpcomingLitter } from '../utils/litters';
import { useToday } from '../utils/useToday';

/** EN/BG links to the current page in each language. Real links, so crawlers can follow them. */
const LanguageSwitch: React.FC<{ onSwitch?: () => void }> = ({ onSwitch }) => {
  const { language, alternatePath, t } = useLanguage();
  return (
    <div role="group" aria-label={t('nav.language')} className="flex items-center text-xs font-bold tracking-widest text-gray-600">
      {LANGUAGES.map((lang) => (
        <Link
          key={lang}
          to={alternatePath(lang)}
          hrefLang={lang}
          lang={lang}
          aria-current={lang === language ? 'true' : undefined}
          // Fetch that language's text as soon as the visitor shows intent to switch.
          onPointerEnter={() => prefetchTranslations(lang)}
          onFocus={() => prefetchTranslations(lang)}
          onClick={() => {
            storeLanguage(lang);
            onSwitch?.();
          }}
          className={`inline-flex items-center justify-center min-h-[44px] min-w-[36px] px-1 transition-colors ${lang === language ? 'text-stella-gold-dark' : 'hover:text-stella-dark'}`}
        >
          {/* Accessible name starts with the visible text (WCAG 2.5.3), then the full language name. */}
          {lang.toUpperCase()}
          <span className="sr-only"> – {LANGUAGE_NAMES[lang]}</span>
        </Link>
      ))}
    </div>
  );
};

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, path, routeId, language } = useLanguage();
  // Next planned litter (PLANNED_LITTERS in constants.ts); the bar disappears once its month has passed.
  const upcoming = getUpcomingLitter(useToday());

  // Typed as the general RouteDef so routes without a navKey are allowed.
  const navRoutes: readonly RouteDef[] = ROUTES;
  const links = navRoutes.flatMap((route) =>
    route.navKey ? [{ id: route.id, name: t(route.navKey), path: path(route.id as RouteId) }] : [],
  );

  const isActive = (id: string) => id === routeId;

  // Escape closes the mobile menu and returns focus to the button that opened it.
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Top Announcement Bar */}
      {upcoming && (
        <div className="on-dark bg-slate-700 text-white text-xs sm:text-sm text-center py-2 px-4 tracking-wide">
          {fill(t('nav.top_announcement'), { month: formatMonth(upcoming.expectedMonth, language) })}{' '}
          <Link to={path('contact', '?interest=waitlist')} className="underline hover:text-stella-gold">{t('nav.join_waitlist')}</Link>
        </div>
      )}

      <nav aria-label={t('nav.main_menu')} className="bg-stella-cream sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo Area */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={path('home')} className="flex flex-col items-center">
                <span className="font-serif text-xl min-[375px]:text-2xl tracking-widest text-stella-dark uppercase">Stella Maris</span>
                <span className="font-sans text-[10px] tracking-[0.3em] text-gray-500 uppercase">{t('nav.subtitle')}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center lg:space-x-5 xl:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  aria-current={isActive(link.id) ? 'page' : undefined}
                  className={`text-sm font-sans tracking-widest uppercase whitespace-nowrap transition-colors duration-200 ${isActive(link.id)
                      ? 'text-stella-gold-dark font-bold'
                      : 'text-gray-700 hover:text-stella-gold-dark'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="ml-4">
                <LanguageSwitch />
              </div>
            </div>

            {/* Mobile: language switch stays visible in the header bar, next to the menu button */}
            <div className="lg:hidden flex items-center gap-1 min-[375px]:gap-2">
              <LanguageSwitch onSwitch={() => setIsOpen(false)} />
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? t('nav.close_menu') : t('nav.open_menu')}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-md text-gray-700 hover:text-stella-gold-dark"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div id="mobile-menu" className="lg:hidden bg-stella-cream border-t border-gray-200 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
              {links.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(link.id) ? 'page' : undefined}
                  className={`block px-3 py-4 rounded-md text-sm font-sans tracking-widest uppercase ${isActive(link.id)
                      ? 'text-stella-gold-dark font-bold'
                      : 'text-gray-700 hover:text-stella-gold-dark'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
