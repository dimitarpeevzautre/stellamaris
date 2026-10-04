import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { FAQ_UPDATED } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { getFaq } from '../utils/faq';
import { fill, formatDate } from '../utils/litters';
import { useToday } from '../utils/useToday';

/**
 * Frequently asked questions (/faq/, /bg/faq/). Every answer is visible in the HTML (no
 * collapsed accordions), so people, search engines and AI assistants can read and quote it.
 * The same answers feed the FAQPage structured data (structuredData.ts).
 */
const FAQ: React.FC = () => {
  const { t, path, language } = useLanguage();
  const today = useToday();
  const sections = getFaq(language, today);

  return (
    <div className="min-h-screen bg-stella-cream py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto text-stella-gold mb-4" size={36} aria-hidden="true" />
          <h1 className="text-4xl font-serif text-stella-dark mb-4">{t('faq.title')}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t('faq.subtitle')}</p>
          <p className="mt-4 text-xs text-gray-500">
            <time dateTime={FAQ_UPDATED}>{fill(t('faq.updated'), { date: formatDate(FAQ_UPDATED, language) })}</time>
          </p>
        </div>

        {/* In-page navigation between the sections */}
        <nav aria-label={t('faq.title')} className="mb-12 flex flex-wrap justify-center gap-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="bg-white border border-gray-200 hover:border-stella-gold text-stella-dark hover:text-stella-gold-dark text-xs font-bold uppercase tracking-widest py-2 px-4 transition-colors"
            >
              {section.title}
            </a>
          ))}
        </nav>

        {sections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="mb-14 scroll-mt-28">
            <h2 id={`${section.id}-title`} className="text-2xl font-serif text-stella-dark mb-6 pb-3 border-b border-stella-sand">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.items.map((item) => (
                <article key={item.id} id={item.id} className="bg-white border border-gray-100 shadow-sm p-6 sm:p-8 scroll-mt-28">
                  <h3 className="text-lg font-bold text-stella-blue mb-3">{item.question}</h3>
                  {item.answer.map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-3 last:mb-0">{paragraph}</p>
                  ))}
                  {item.link && (
                    <Link
                      to={path(item.link.route, item.link.search)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors"
                    >
                      {item.link.label}
                      <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="bg-stella-sand/30 p-8 text-center">
          <h2 className="text-2xl font-serif text-stella-dark mb-3">{t('faq.more_title')}</h2>
          <p className="text-gray-700 mb-6">{t('faq.more_text')}</p>
          <Link
            to={path('contact')}
            className="inline-block bg-stella-gold hover:bg-[#b8952b] text-stella-dark font-bold py-4 px-10 uppercase tracking-widest text-xs transition duration-300"
          >
            {t('faq.contact_link')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
