import React from 'react';
import { DOGS } from '../constants';
import { Award, ShieldCheck, Calendar, Info, Trophy } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const OurDogs: React.FC = () => {
    const { t } = useLanguage();

    const translatedDogs = DOGS.map(dog => ({
        ...dog,
        description: dog.id === 'sire-1' ? t('dogs.arthur.description') : t('dogs.riva.description'),
        prizes: (dog.id === 'sire-1' ? t('dogs.arthur.prizes') : t('dogs.riva.prizes')) as unknown as string[]
    }));

    const male = translatedDogs.find(d => d.gender === 'Male');
    const female = translatedDogs.find(d => d.gender === 'Female');

    return (
        <div className="min-h-screen bg-stella-cream">
            {/* Header */}
            <div className="py-24 text-center">
                <h1 className="text-5xl font-serif text-stella-dark mb-4">{t('dogs.title')}</h1>
                <div className="h-1 w-24 bg-stella-gold mx-auto mb-6"></div>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed px-4">
                    {t('dogs.subtitle')}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                {/* Male Dog Section */}
                {male && (
                    <div className="flex flex-col lg:flex-row items-center gap-16 mb-32 group">
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-stella-gold translate-x-4 translate-y-4 opacity-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
                            <div className="relative overflow-hidden aspect-[4/5] shadow-2xl">
                                <img
                                    src={male.image}
                                    alt={male.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-8">
                            <div>
                                <span className="text-stella-gold font-sans text-xs font-bold tracking-[0.3em] uppercase mb-2 block">{t('dogs.male_role')}</span>
                                <h2 className="text-5xl font-serif text-stella-dark mb-1">{male.name}</h2>
                                <p className="text-gray-400 font-sans text-xs uppercase tracking-widest">{male.registeredName}</p>
                            </div>

                            <p className="text-lg text-gray-700 leading-relaxed font-light">
                                {male.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                {/* Prizes */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center text-sm font-bold uppercase tracking-widest text-stella-dark">
                                        <Trophy className="w-4 h-4 mr-2 text-stella-gold" />
                                        {t('dogs.achievements')}
                                    </h4>
                                    <ul className="space-y-3">
                                        {male.prizes?.map((prize, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                <span className="text-stella-gold mr-2 italic">★</span>
                                                {prize}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Health */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center text-sm font-bold uppercase tracking-widest text-stella-dark">
                                        <ShieldCheck className="w-4 h-4 mr-2 text-stella-gold" />
                                        {t('dogs.health')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {male.healthClearances.map((c, i) => (
                                            <span key={i} className="bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-tighter px-3 py-1 text-gray-500 rounded-full">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Female Dog Section - Alternating */}
                {female && (
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16 group">
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-stella-gold -translate-x-4 translate-y-4 opacity-10 group-hover:-translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
                            <div className="relative overflow-hidden aspect-[4/5] shadow-2xl">
                                <img
                                    src={female.image}
                                    alt={female.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-8">
                            <div>
                                <span className="text-stella-gold font-sans text-xs font-bold tracking-[0.3em] uppercase mb-2 block text-right lg:text-left">{t('dogs.female_role')}</span>
                                <h2 className="text-5xl font-serif text-stella-dark mb-1 text-right lg:text-left">{female.name}</h2>
                                <p className="text-gray-400 font-sans text-xs uppercase tracking-widest text-right lg:text-left">{female.registeredName}</p>
                            </div>

                            <p className="text-lg text-gray-700 leading-relaxed font-light text-right lg:text-left">
                                {female.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                {/* Health */}
                                <div className="space-y-4 order-2 md:order-1">
                                    <h4 className="flex items-center text-sm font-bold uppercase tracking-widest text-stella-dark lg:justify-start justify-end">
                                        <ShieldCheck className="w-4 h-4 mr-2 text-stella-gold" />
                                        {t('dogs.health')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2 lg:justify-start justify-end">
                                        {female.healthClearances.map((c, i) => (
                                            <span key={i} className="bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-tighter px-3 py-1 text-gray-500 rounded-full">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {/* Prizes */}
                                <div className="space-y-4 order-1 md:order-2">
                                    <h4 className="flex items-center text-sm font-bold uppercase tracking-widest text-stella-dark lg:justify-start justify-end">
                                        <Trophy className="w-4 h-4 mr-2 text-stella-gold" />
                                        {t('dogs.achievements')}
                                    </h4>
                                    <ul className="space-y-3 lg:text-left text-right">
                                        {female.prizes?.map((prize, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start lg:justify-start justify-end">
                                                <span className="hidden lg:inline text-stella-gold mr-2 italic">★</span>
                                                {prize}
                                                <span className="lg:hidden text-stella-gold ml-2 italic">★</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Decorative Quote Section */}
            <section className="bg-stella-dark py-24 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-3xl font-serif italic mb-8 opacity-80 leading-relaxed">
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