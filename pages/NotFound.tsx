import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import type { RouteId } from '../routes';

/** Catch-all page. Prerendered to dist/404.html, which GitHub Pages serves with a 404 status. */
const NotFound: React.FC = () => {
  const { t, path } = useLanguage();

  const links: { id: RouteId; label: string }[] = [
    { id: 'home', label: t('nav.home') },
    { id: 'dogs', label: t('nav.our_dogs') },
    { id: 'puppies', label: t('nav.puppies') },
    { id: 'faq', label: t('nav.faq') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <div className="min-h-[70vh] bg-stella-cream py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <PawPrint className="mx-auto text-stella-gold mb-6" size={40} />
        <p className="text-stella-gold-dark font-sans text-xs font-bold tracking-[0.3em] uppercase mb-4">404</p>
        <h1 className="text-4xl font-serif text-stella-dark mb-6">{t('not_found.title')}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">{t('not_found.desc')}</p>

        <nav aria-label={t('not_found.links_label')} className="flex flex-wrap justify-center gap-4 mb-12">
          {links.map((link) => (
            <Link
              key={link.id}
              to={path(link.id)}
              className="bg-white border border-gray-200 hover:border-stella-gold text-stella-dark hover:text-stella-gold-dark font-sans text-xs font-bold tracking-widest uppercase py-3 px-6 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-gray-500">
          {t('not_found.contact')}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-stella-blue hover:text-stella-gold-dark">{CONTACT_EMAIL}</a>
          {' · '}
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-stella-blue hover:text-stella-gold-dark">{CONTACT_PHONE}</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
