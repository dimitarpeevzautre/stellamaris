import React from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_WHATSAPP, SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM } from '../constants';
import { Link } from 'react-router-dom';
import WhatsAppIcon from './WhatsAppIcon';
import { openConsentSettings } from '../utils/analytics';
import { useToday } from '../utils/useToday';
import { ROUTES, type RouteDef, type RouteId } from '../routes';

import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t, path } = useLanguage();
  // Starts at the build year (matches the prerendered HTML), then follows the visitor's clock.
  const year = useToday().slice(0, 4);

  // Same pages as the main navigation, so every page is linked from every page.
  const navRoutes: readonly RouteDef[] = ROUTES;
  const siteLinks = navRoutes.flatMap((route) =>
    route.navKey ? [{ id: route.id as RouteId, label: t(route.navKey) }] : [],
  );

  return (
    <footer className="bg-stella-cream text-stella-dark py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">

          {/* Left Column: Brand & Description */}
          <div className="md:w-1/2">
            <p className="text-3xl font-serif mb-6 text-stella-dark">{t('footer.brand')}</p>
            <p className="text-sm leading-relaxed text-gray-700 max-w-md mb-6">
              {t('footer.description')}
            </p>
            <p className="flex items-center text-sm text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" aria-hidden="true" />
              {t('footer.location')}
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-gray-500">{t('footer.registration')}</p>
          </div>

          {/* Right Column: Contact Details */}
          <div className="md:w-1/2 flex flex-col items-start md:items-start space-y-4">
            <div className="flex items-center group">
              <Mail className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold-dark transition-colors" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-medium text-stella-dark hover:text-stella-gold-dark transition-colors">
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="flex items-center group">
              <Phone className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold-dark transition-colors" />
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-sm font-medium text-stella-dark hover:text-stella-gold-dark transition-colors">
                {CONTACT_PHONE}
              </a>
            </div>

            <div className="flex items-center group">
              <WhatsAppIcon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold-dark transition-colors" />
              <a href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-stella-dark hover:text-stella-gold-dark transition-colors">
                {t('contact.whatsapp_chat')}
              </a>
            </div>

            <div className="flex items-center group">
              <Facebook className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold-dark transition-colors" />
              <a href={SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-stella-dark hover:text-stella-gold-dark transition-colors">
                portuguesewaterdogbulgaria
              </a>
            </div>

            <div className="flex items-center group">
              <Instagram className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold-dark transition-colors" />
              <a href={SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-stella-dark hover:text-stella-gold-dark transition-colors">
                pwdbulgaria
              </a>
            </div>
          </div>

        </div>

        <nav aria-label={t('footer.site_label')} className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-gray-600">
          {siteLinks.map((link) => (
            <Link key={link.id} to={path(link.id)} className="hover:text-stella-gold-dark transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-500">
          <p>
            © {year} {t('footer.brand')} · {t('footer.location')}. {t('footer.rights')}
          </p>
          <nav aria-label={t('footer.legal_label')} className="flex flex-wrap gap-x-6 gap-y-2 uppercase tracking-widest">
            <Link to={path('privacy')} className="hover:text-stella-gold-dark transition-colors">
              {t('footer.privacy')}
            </Link>
            <button type="button" onClick={openConsentSettings} className="uppercase tracking-widest hover:text-stella-gold-dark transition-colors">
              {t('footer.cookie_settings')}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
