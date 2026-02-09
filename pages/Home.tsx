import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Award, Bone, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('home.feature1.title'),
      description: t('home.feature1.desc'),
      Icon: PawPrint
    },
    {
      title: t('home.feature2.title'),
      description: t('home.feature2.desc'),
      Icon: Award
    },
    {
      title: t('home.feature3.title'),
      description: t('home.feature3.desc'),
      Icon: Bone
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
    <div className="animate-fade-in bg-stella-cream">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image: High-quality PWD in a garden/nature setting, matching the breeder's photo vibe */}
        <div
          className="absolute inset-0 bg-cover bg-left md:bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/puppies.jpg")' }}
        >
          {/* Subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/35"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
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
            <div className="flex gap-4">
              <Link
                to="/puppies"
                className="bg-stella-gold hover:bg-[#b8952b] text-stella-dark font-sans text-xs font-bold tracking-widest py-4 px-10 uppercase transition-all duration-300 inline-block shadow-lg"
              >
                {t('home.view_puppies')}
              </Link>
              <Link
                to="/about"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-sans text-xs font-bold tracking-widest py-4 px-10 uppercase transition-all duration-300 inline-block shadow-lg border border-white/30"
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url("/images/steliandpuppy.jpg")' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">{t('home.happy_families')}</h2>
            <div className="h-1 w-20 bg-stella-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                <div className="mb-6 text-stella-gold">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.082 15.435 13.664 17.435 11.664L17.435 11.664L14.017 11.664C14.017 7.583 17.583 4.017 21.017 4.017L21.017 6C18.88 6 17.017 7.863 17.017 10.017L21.017 10.017L21.017 21L14.017 21ZM5 21L5 18C5 16.082 6.418 13.664 8.418 11.664L8.418 11.664L5 11.664C5 7.583 8.567 4.017 12 4.017L12 6C9.863 6 8 7.863 8 10.017L12 10.017L12 21L5 21Z" /></svg>
                </div>
                <p className="text-lg font-light leading-relaxed mb-6 italic opacity-90">
                  "{t.text}"
                </p>
                <p className="font-bold text-stella-gold uppercase tracking-wider text-xs">
                  — {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;