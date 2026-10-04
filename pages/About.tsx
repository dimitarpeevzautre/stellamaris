import React from 'react';
import { Link } from 'react-router-dom';
import { ABOUT_GALLERY, KENNEL } from '../constants';
import { ArrowRight, CheckCircle, ExternalLink, Newspaper } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import Picture from '../components/Picture';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t, path } = useLanguage();
  const press = KENNEL.press[0];
  return (
    <div className="min-h-screen bg-stella-cream py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-stella-dark mb-4">{t('about.title')}</h1>
          <p className="text-lg text-gray-500 italic">{t('about.subtitle')}</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 overflow-hidden mb-16">
          {/* LCP image of this page: eager, high priority; width/height reserve its space. */}
          <Picture
            src="/images/family.jpg"
            alt={t('about.family_photo_alt')}
            sizes="(min-width: 896px) 896px, 100vw"
            loading="eager"
            fetchPriority="high"
            pictureClassName="block"
            className="w-full h-auto"
          />
          <div className="p-8 sm:p-16 space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {t('about.story_p1')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {t('about.story_p2')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {t('about.story_p3')}
            </p>

            <h2 className="text-2xl font-serif text-stella-dark pt-6">{t('about.journey_title')}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{t('about.journey')}</p>
            <p className="text-lg text-gray-700 leading-relaxed">{t('about.philosophy')}</p>
            <p className="text-lg text-gray-700 leading-relaxed italic">{t('about.name_meaning')}</p>

            {/* Independent coverage (see KENNEL.press in constants.ts for the source). */}
            <aside className="mt-10 bg-stella-cream border border-stella-sand p-6 sm:p-8 flex gap-4" aria-labelledby="about-press-title">
              <Newspaper className="text-stella-gold h-6 w-6 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 id="about-press-title" className="text-sm font-bold uppercase tracking-widest text-stella-dark mb-3">{t('about.press_title')}</h2>
                <p className="text-gray-700 leading-relaxed mb-3">{t('about.press_text')}</p>
                <a
                  href={press.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  hrefLang={press.inLanguage}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors"
                >
                  {t('about.press_link')}
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </aside>

            <div className="my-12">
              <h2 className="text-xl font-bold uppercase tracking-widest text-stella-dark mb-8">{t('about.standards_title')}</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(t('about.standards') as unknown as string[]).map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="text-stella-gold mr-4 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium uppercase tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-10">
              <Link to={path('dogs')} className="inline-flex items-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
                {t('about.dogs_link')}
                <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </Link>
              <Link to={path('puppies')} className="inline-flex items-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
                {t('about.puppies_link')}
                <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Life at Stella Maris Carousel */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-serif text-stella-dark mb-4">{t('about.gallery_title')}</h2>
          <div className="h-px w-20 bg-stella-gold mx-auto mb-8"></div>
          <div className="max-w-3xl mx-auto shadow-xl rounded-2xl overflow-hidden">
            <ImageCarousel
              images={ABOUT_GALLERY.map((photo) => ({ src: photo.src, alt: t(photo.altKey) }))}
              label={t('about.gallery_title')}
              frameClassName="aspect-square sm:aspect-[4/3]"
              sizes="(min-width: 800px) 768px, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
