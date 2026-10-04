import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, ShieldCheck, Trophy } from 'lucide-react';
import { DOGS, DOG_PHOTO_SIZES } from '../constants';
import type { Dog, HealthResult, HealthTestKey } from '../types';
import Picture from '../components/Picture';
import { useLanguage } from '../context/LanguageContext';
import { fill } from '../utils/litters';

/**
 * DNA tests that are inherited in an autosomal recessive way: a carrier paired with a clear
 * partner cannot produce affected puppies. Only list tests where this is well established.
 */
const RECESSIVE_TESTS: readonly HealthTestKey[] = ['prcd_pra', 'gm1'];

/** Carrier × clear pairs between the sire and the dam, for the explanation under the dogs. */
const carrierPairs = (dogs: Dog[]) => {
  const pairs: { test: HealthTestKey; carrier: Dog; clear: Dog }[] = [];
  for (const carrier of dogs) {
    for (const result of carrier.healthResults) {
      if (result.status !== 'carrier' || !RECESSIVE_TESTS.includes(result.test)) continue;
      const partner = dogs.find(
        (dog) =>
          dog.gender !== carrier.gender &&
          dog.healthResults.some((r) => r.test === result.test && r.status === 'clear'),
      );
      if (partner) pairs.push({ test: result.test, carrier, clear: partner });
    }
  }
  return pairs;
};

const HealthTable: React.FC<{ results: HealthResult[]; caption: string }> = ({ results, caption }) => {
  const { t } = useLanguage();
  const resultText = (r: HealthResult) => {
    if (r.status === 'graded') return `${t('health.status.graded')} ${r.value ?? ''}`.trim();
    const label = t(`health.status.${r.status}`);
    return r.value ? `${label} (${r.value})` : label;
  };
  return (
    <div className="overflow-hidden border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-stella-cream text-xs uppercase tracking-widest text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold">{t('health.test')}</th>
            <th scope="col" className="px-4 py-3 font-bold whitespace-nowrap">{t('health.result')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((r) => {
            const about = t(`health.tests.${r.test}.about`);
            return (
              <tr key={r.test} className="align-top">
                <th scope="row" className="px-4 py-3 font-normal text-gray-700">
                  <span className="font-semibold text-stella-dark">{t(`health.tests.${r.test}.name`)}</span>
                  {about && <span className="block text-xs text-gray-500 leading-relaxed mt-1">{about}</span>}
                </th>
                <td className={`px-4 py-3 font-semibold whitespace-nowrap ${r.status === 'carrier' ? 'text-amber-700' : 'text-green-700'}`}>
                  {resultText(r)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const OurDogs: React.FC = () => {
  const { t, path } = useLanguage();
  // Name, description and titles come from translations keyed by the dog's id, so adding a dog
  // only needs a DOGS entry plus `dogs.profiles.<id>` in both languages.
  const profile = (dog: Dog) => ({
    name: t(`dogs.profiles.${dog.id}.name`),
    description: t(`dogs.profiles.${dog.id}.description`),
    prizes: t(`dogs.profiles.${dog.id}.prizes`) as unknown as string[] | string,
  });
  const pairs = carrierPairs(DOGS);

  return (
    <div className="min-h-screen bg-stella-cream">
      {/* Header */}
      <div className="py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-stella-dark mb-4">{t('dogs.title')}</h1>
        <div className="h-1 w-24 bg-stella-gold mx-auto mb-6"></div>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
          {t('dogs.subtitle')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {DOGS.map((dog, index) => {
          const { name, description, prizes } = profile(dog);
          const isSire = dog.gender === 'Male';
          const reversed = index % 2 === 1;
          return (
            <section
              key={dog.id}
              id={dog.id}
              aria-labelledby={`dog-${dog.id}`}
              className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-start gap-16 mb-32 group scroll-mt-28`}
            >
              <div className="w-full lg:w-1/2 relative lg:sticky lg:top-32">
                <div className={`absolute inset-0 bg-stella-gold ${reversed ? '-translate-x-4' : 'translate-x-4'} translate-y-4 opacity-10 transition-transform duration-500`}></div>
                <div className="relative overflow-hidden aspect-[4/5] shadow-2xl">
                  <Picture
                    src={dog.image}
                    alt={`${name} — ${dog.registeredName}, ${t(isSire ? 'dogs.sire_alt' : 'dogs.dam_alt')}`}
                    sizes={DOG_PHOTO_SIZES}
                    // The first dog is this page's LCP image; the others are below the fold.
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-8">
                <div>
                  <span className="text-stella-gold-dark font-sans text-xs font-bold tracking-[0.3em] uppercase mb-2 block">
                    {t(isSire ? 'dogs.male_role' : 'dogs.female_role')}
                  </span>
                  <h2 id={`dog-${dog.id}`} className="text-5xl font-serif text-stella-dark mb-1">{name}</h2>
                  <p className="text-gray-600 font-sans text-xs uppercase tracking-widest">{dog.registeredName}</p>
                </div>

                <div className="space-y-4">
                  {description.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-lg text-gray-700 leading-relaxed font-light">{paragraph}</p>
                  ))}
                </div>

                {Array.isArray(prizes) && prizes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="flex items-center text-sm font-bold uppercase tracking-widest text-stella-dark">
                      <Trophy className="w-4 h-4 mr-2 text-stella-gold" aria-hidden="true" />
                      {t('dogs.achievements')}
                    </h3>
                    <ul className="space-y-3">
                      {prizes.map((prize, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="text-stella-gold mr-2" aria-hidden="true">★</span>
                          {prize}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="flex items-center text-sm font-bold uppercase tracking-widest text-stella-dark">
                    <ShieldCheck className="w-4 h-4 mr-2 text-stella-gold" aria-hidden="true" />
                    {t('dogs.health')}
                  </h3>
                  <HealthTable results={dog.healthResults} caption={`${t('dogs.health')}: ${name}`} />
                </div>
              </div>
            </section>
          );
        })}

        {/* Carrier results explained (e.g. a prcd-PRA carrier paired with a clear partner) */}
        {pairs.length > 0 && (
          <section aria-labelledby="carrier-note" className="max-w-3xl mx-auto mb-16 bg-white border border-stella-sand p-8 flex gap-4">
            <Info className="text-stella-blue flex-shrink-0 mt-1" size={24} aria-hidden="true" />
            <div className="space-y-3">
              <h2 id="carrier-note" className="font-bold text-lg text-stella-blue">{t('health.carrier_title')}</h2>
              {pairs.map(({ test, carrier, clear }) => (
                <p key={`${carrier.id}-${test}`} className="text-gray-700 leading-relaxed">
                  {fill(t('health.carrier_note'), {
                    carrier: profile(carrier).name,
                    clear: profile(clear).name,
                    test: t(`health.tests.${test}.name`).replace(/\s*\((DNA|ДНК)\)$/, ''),
                  })}
                </p>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-10 text-center">
          <Link to={path('puppies')} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
            {t('dogs.puppies_link')}
            <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          </Link>
          <Link to={path('faq')} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
            {t('dogs.faq_link')}
            <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Decorative Quote Section */}
      <section className="bg-stella-dark py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-2xl md:text-3xl font-serif italic mb-8 opacity-80 leading-relaxed">
            {t('dogs.quote')}
          </p>
          <div className="flex justify-center items-center gap-4">
            <div className="h-px w-12 bg-stella-gold"></div>
            <span className="text-stella-gold font-sans text-xs font-bold tracking-widest uppercase">{t('dogs.philosophy')}</span>
            <div className="h-px w-12 bg-stella-gold"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurDogs;
