import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CONTACT_EMAIL, PRIVACY_UPDATED } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { PRIVACY_SECTIONS } from '../utils/privacyPolicy';
import { openConsentSettings } from '../utils/analytics';
import { fill, formatDate } from '../utils/litters';

const linkClass = 'text-stella-blue underline underline-offset-2 hover:text-stella-gold-dark transition-colors';

/** Render {email} as a mailto link and [label](https://…) as an external link. */
const RichText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\{email\}|\[[^\]]+\]\(https:\/\/[^)\s]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part === '{email}') {
          return (
            <a key={i} href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
              {CONTACT_EMAIL}
            </a>
          );
        }
        const link = /^\[([^\]]+)\]\((https:\/\/[^)\s]+)\)$/.exec(part);
        if (link) {
          return (
            <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {link[1]}
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

const Privacy: React.FC = () => {
  const { t, language } = useLanguage();
  const sections = PRIVACY_SECTIONS[language];

  return (
    <div className="min-h-screen bg-stella-cream py-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <ShieldCheck className="mx-auto text-stella-gold mb-6" size={40} strokeWidth={1.5} aria-hidden="true" />
          <h1 className="text-4xl font-serif text-stella-dark mb-4">{t('privacy.title')}</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            <time dateTime={PRIVACY_UPDATED}>{fill(t('privacy.updated'), { date: formatDate(PRIVACY_UPDATED, language) })}</time>
          </p>
        </header>

        <div className="bg-white p-6 sm:p-10 shadow-sm border border-gray-100 space-y-10 text-gray-700 leading-relaxed">
          <p className="text-lg">{t('privacy.intro')}</p>

          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-serif text-stella-dark mb-4">{section.heading}</h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
                {section.items && (
                  <ul className="list-disc pl-6 space-y-1">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.after?.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </section>
          ))}

          <div className="border-t border-gray-100 pt-8">
            <button
              type="button"
              onClick={openConsentSettings}
              className="bg-stella-blue hover:bg-stella-dark text-white font-bold py-3 px-6 uppercase tracking-widest text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stella-gold focus-visible:ring-offset-2"
            >
              {t('footer.cookie_settings')}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Privacy;
