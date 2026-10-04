import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, ShieldCheck, PawPrint, Heart, ArrowRight, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Picture from '../components/Picture';
import { HOME_HERO_IMAGE, SOCIAL_FACEBOOK, TESTIMONIALS_BACKGROUND_IMAGE } from '../constants';

const Home: React.FC = () => {
  const { t, path, language } = useLanguage();

  const features = [
    {
      title: t('home.feature1.title'),
      description: t('home.feature1.desc'),
      Icon: HomeIcon
    },
    {
      title: t('home.feature2.title'),
      description: t('home.feature2.desc'),
      Icon: ShieldCheck
    },
    {
      title: t('home.feature3.title'),
      description: t('home.feature3.desc'),
      Icon: PawPrint
    },
    {
      title: t('home.feature4.title'),
      description: t('home.feature4.desc'),
      Icon: Heart
    }
  ];

  const testimonials = [
    {
      text: t('home.testimonial1.text'),
      author: t('home.testimonial1.author')
    },
    {
      text: t('home.testimonial2.text'),
      author: t('home.testimonial2.author')
    },
    {
      text: t('home.testimonial3.text'),
      author: t('home.testimonial3.author')
    }
  ];

  return (
    <div className="bg-stella-cream">
      {/* Hero Section */}
      <div className="on-dark relative min-h-[85vh] w-full overflow-hidden">
        {/* Hero photo: a real <img> so it is the LCP element and indexable. routes.ts preloads the
            same srcset/sizes on the home pages, so keep HOME_HERO_IMAGE as the single source. */}
        <Picture
          src={HOME_HERO_IMAGE.src}
          alt={t('home.hero_image_alt')}
          sizes={HOME_HERO_IMAGE.sizes}
          loading="eager"
          fetchPriority="high"
          pictureClassName="absolute inset-0 block"
          className="w-full h-full object-cover object-left md:object-center"
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* min-h, not a fixed height: on small phones (long Bulgarian title) the text must not be clipped. */}
        <div className="relative min-h-[85vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
          <div className="max-w-3xl text-white">

            {/* FCI Registration Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-stella-gold animate-pulse"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">{t('home.fci_registered')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6 drop-shadow-lg whitespace-pre-line">
              {t('home.hero_title')}
            </h1>
            <p className="text-lg md:text-xl font-light mb-8 drop-shadow-md opacity-95 leading-relaxed max-w-2xl">
              {t('home.hero_desc')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={path('contact', '?interest=waitlist')}
                className="bg-stella-gold hover:bg-[#b8952b] text-stella-dark font-sans text-xs font-bold tracking-widest py-4 px-6 sm:px-10 uppercase text-center transition-all duration-300 inline-block shadow-lg"
              >
                {t('home.puppy_inquiry')}
              </Link>
              <Link
                to={path('about')}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-sans text-xs font-bold tracking-widest py-4 px-6 sm:px-10 uppercase text-center transition-all duration-300 inline-block shadow-lg border border-white/30"
              >
                {t('home.our_story')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* "What sets us apart" Section */}
      <section className="py-24 bg-stella-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif text-stella-dark">{t('home.features_title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative mb-6 h-12 w-12">
                  <feature.Icon
                    size={48}
                    strokeWidth={1.5}
                    className="absolute top-[2px] left-[2px] text-[#c4a484]/60"
                  />
                  <feature.Icon
                    size={48}
                    strokeWidth={1.5}
                    className="absolute top-0 left-0 text-slate-700"
                  />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-stella-dark">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contextual links: from the overview to the dogs' health results and the FAQ */}
          <div className="mt-16 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-10 text-center">
            <Link to={path('dogs')} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
              {t('home.meet_dogs_link')}
              <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            </Link>
            <Link to={path('faq')} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
              {t('home.faq_link')}
              <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="on-dark py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative background: a small blurred copy, lazy-loaded, hidden from assistive tech */}
        <Picture
          src={TESTIMONIALS_BACKGROUND_IMAGE}
          alt=""
          aria-hidden="true"
          pictureClassName="absolute inset-0 block opacity-20"
          className="w-full h-full object-cover object-center"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">{t('home.happy_families')}</h2>
            <div className="h-1 w-20 bg-stella-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                <div className="mb-6 text-stella-gold">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.082 15.435 13.664 17.435 11.664L17.435 11.664L14.017 11.664C14.017 7.583 17.583 4.017 21.017 4.017L21.017 6C18.88 6 17.017 7.863 17.017 10.017L21.017 10.017L21.017 21L14.017 21ZM5 21L5 18C5 16.082 6.418 13.664 8.418 11.664L8.418 11.664L5 11.664C5 7.583 8.567 4.017 12 4.017L12 6C9.863 6 8 7.863 8 10.017L12 10.017L12 21L5 21Z" /></svg>
                </div>
                <p className="text-lg font-light leading-relaxed mb-6 italic opacity-90">
                  {language === 'bg' ? `„${testimonial.text}“` : `“${testimonial.text}”`}
                </p>
                <p className="font-bold text-stella-gold uppercase tracking-wider text-xs">
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center">
            <a href={SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-stella-gold hover:text-white transition-colors">
              <Facebook className="w-4 h-4" aria-hidden="true" />
              {t('home.testimonials_more')}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;