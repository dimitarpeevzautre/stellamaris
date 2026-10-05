
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LITTERS, AVAILABLE_PUPPIES, LITTERS_UPDATED, PUPPY_HOMES } from '../constants';
import { Calendar, Baby, PawPrint, Users, ArrowRight, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import Picture from '../components/Picture';
import type { Map as LeafletMap } from 'leaflet';

import { useLanguage } from '../context/LanguageContext';
import { fill, formatDate, formatMonth, getLastHomedLitter, getUpcomingLitter, weeksBetween } from '../utils/litters';
import { useToday } from '../utils/useToday';

/**
 * Map tiles: OpenStreetMap's standard tile layer (no API key; CARTO's keyless basemaps now return
 * an 'API key required' image). Usage policy, checked 4 October 2026:
 * https://operations.osmfoundation.org/policies/tiles/ — use exactly this URL (no a/b/c subdomains),
 * keep the attribution visible on the map, send a Referer (index.html: strict-origin-when-cross-origin)
 * and no bulk/prefetch downloads. Access is best-effort and can be withdrawn: see owner-todo.
 */
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const PuppyLocationMap = () => {
    const { t } = useLanguage();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);
    // Leaflet (~45 kB gzip + CSS + tiles) is only fetched once the map is about to scroll into view.
    const [nearViewport, setNearViewport] = useState(false);
    // On phones the map starts "locked" so a swipe over it scrolls the page; a tap unlocks it.
    const [touchLocked, setTouchLocked] = useState(false);

    // Data: PUPPY_HOMES in constants.ts (some, not all, of the homes our puppies live in).
    const locations = useMemo(() => PUPPY_HOMES.map((home) => ({
        ...home,
        country: t(`puppies.locations.${home.countryKey}`),
        city: home.cityKey ? t(`puppies.locations.${home.cityKey}`) : undefined,
    })), [t]);

    useEffect(() => {
        const container = mapContainerRef.current;
        if (!container || nearViewport) return;
        if (typeof IntersectionObserver === 'undefined') {
            setNearViewport(true);
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                setNearViewport(true);
                observer.disconnect();
            }
        }, { rootMargin: '200px 0px' });
        observer.observe(container);
        return () => observer.disconnect();
    }, [nearViewport]);

    useEffect(() => {
        if (!nearViewport || !mapContainerRef.current) return;
        let cancelled = false;
        let visibilityObserver: IntersectionObserver | undefined;

        (async () => {
            const [{ default: L }] = await Promise.all([
                import('leaflet'),
                import('leaflet/dist/leaflet.css'),
            ]);
            const container = mapContainerRef.current;
            if (cancelled || !container || mapInstanceRef.current) return;

            // With one-finger dragging enabled, Leaflet sets touch-action: none and swallows page scrolls.
            const lockTouch = L.Browser.mobile;
            const map = L.map(container, {
                scrollWheelZoom: false,
                dragging: !lockTouch,
                touchZoom: !lockTouch,
                attributionControl: true
            });
            // Keep the attribution compact: only the credits the tile and data licences require.
            map.attributionControl.setPrefix(false);

            L.tileLayer(TILE_URL, {
                attribution: TILE_ATTRIBUTION,
                maxZoom: 19
            }).addTo(map);

            locations.forEach((loc) => {
                const icon = L.divIcon({
                    className: 'bg-transparent',
                    html: `<div style="width: 24px; height: 24px; background-color: #d4af37; border: 2px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${loc.count}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                    popupAnchor: [0, -12]
                });

                const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

                const unit = loc.count === 1 ? t('puppies.locations.puppy') : t('puppies.locations.puppies');
                const popupContent = `
                <div style="text-align: center; font-family: ui-sans-serif, system-ui, sans-serif; padding: 4px;">
                    <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 10px; color: #1e3a8a; margin-bottom: 2px; font-weight: bold; margin-top: 0;">
                        ${loc.city || loc.country}
                    </p>
                    <p style="color: #d4af37; font-family: Georgia, serif; font-size: 14px; font-weight: bold; margin: 0;">
                        ${loc.count} ${unit}
                    </p>
                </div>
            `;

                marker.bindPopup(popupContent);
            });

            // Fit every home in view: a fixed centre and zoom cut off Portugal and Bulgaria on phones.
            map.fitBounds(L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng])), { padding: [24, 24], maxZoom: 6 });

            if (lockTouch) {
                const unlock = () => {
                    map.dragging.enable();
                    map.touchZoom.enable();
                    setTouchLocked(false);
                };
                const lock = () => {
                    map.dragging.disable();
                    map.touchZoom.disable();
                    setTouchLocked(true);
                    map.once('click', unlock);
                };
                lock();
                // Lock again once the map has been scrolled out of view.
                if (typeof IntersectionObserver !== 'undefined') {
                    visibilityObserver = new IntersectionObserver((entries) => {
                        if (entries.every((entry) => !entry.isIntersecting) && map.dragging.enabled()) {
                            lock();
                        }
                    });
                    visibilityObserver.observe(container);
                }
            }

            mapInstanceRef.current = map;
        })();

        return () => {
            cancelled = true;
            visibilityObserver?.disconnect();
            setTouchLocked(false);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [nearViewport, locations, t]);

    return (
        <div className="w-full bg-stella-blue/5 rounded-3xl p-8 border border-stella-blue/10">
            <div className="mb-8 text-center">
                <h3 className="text-2xl font-serif text-stella-dark font-bold mb-2">{t('puppies.map_title')}</h3>
                <p className="text-gray-600">{t('puppies.map_subtitle')}</p>
            </div>

            {/* Map Container: fixed height, so loading the map later never shifts the page */}
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-inner border border-blue-100 bg-[#f2f2ef] z-0">
                <div ref={mapContainerRef} role="region" aria-label={t('puppies.map_label')} className="w-full h-full z-10"></div>
                {touchLocked && (
                    <p className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] max-w-[80%] text-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stella-dark shadow">
                        {t('puppies.map_touch_hint')}
                    </p>
                )}
            </div>

            {/* Legend / Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {locations.map((loc) => (
                    <div key={loc.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-2xl font-serif text-stella-gold-dark font-bold">{loc.count}</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{loc.country}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Puppies: React.FC = () => {
    const { t, language, path } = useLanguage();

    const today = useToday();
    const upcoming = getUpcomingLitter(today);
    const lastHomed = getLastHomedLitter();

    const translatedLitters = LITTERS.map(litter => ({
        ...litter,
        name: t(`puppies.litters.${litter.translationKey}.name`),
        description: t(`puppies.litters.${litter.translationKey}.description`),
        statusText: t(`puppies.status.${litter.status.toLowerCase().replace(/ /g, '_')}`),
        whelpMonth: formatMonth(litter.whelpDate, language),
        whelpDateText: formatDate(litter.whelpDate, language),
        goHomeDateText: formatDate(litter.goHomeDate, language),
    }));
    const currentLitters = translatedLitters.filter(litter => litter.status !== 'Sold Out');
    const pastLitters = translatedLitters.filter(litter => litter.status === 'Sold Out');
    const hasAvailability = AVAILABLE_PUPPIES.length > 0 || currentLitters.length > 0;

    const renderLitter = (litter: typeof translatedLitters[number], Heading: 'h2' | 'h3') => {
        const SubHeading = Heading === 'h2' ? 'h3' : 'h4';
        return (
        <div key={litter.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 min-h-[300px] md:h-auto relative">
                    <Picture src={litter.image.src} alt={t(litter.image.altKey)} sizes="(min-width: 1280px) 490px, (min-width: 768px) 40vw, 100vw" pictureClassName="absolute inset-0 block" className="w-full h-full object-cover object-[50%_30%]" />
                    <div className="absolute top-4 left-4">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md
                        ${litter.status === 'Available' ? 'bg-green-700 text-white' :
                                litter.status === 'Planned' ? 'bg-blue-700 text-white' : 'bg-gray-600 text-white'}`}>
                            {litter.statusText}
                        </span>
                    </div>
                </div>
                <div className="p-8 md:w-3/5 flex flex-col justify-center">
                    <Heading className="text-3xl font-serif font-bold text-stella-blue mb-2">
                        {litter.name}: {litter.sire} x {litter.dam}
                    </Heading>
                    <p className="text-gray-500 text-sm mb-6 uppercase tracking-wide">
                        {litter.status === 'Planned' ? t('puppies.expecting') : t('puppies.arrived')} {litter.whelpMonth}
                    </p>

                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        {litter.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Calendar className="mr-3 text-stella-gold" size={20} />
                            <div>
                                <p className="text-xs text-gray-600 font-bold uppercase">{t('puppies.whelp_date')}</p>
                                <p className="font-medium">{litter.whelpDateText}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Baby className="mr-3 text-stella-gold" size={20} />
                            <div>
                                <p className="text-xs text-gray-600 font-bold uppercase">{t('puppies.go_home_date')}</p>
                                <p className="font-medium">{litter.goHomeDateText}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Users className="mr-3 text-stella-gold" size={20} />
                            <div>
                                <p className="text-xs text-gray-600 font-bold uppercase">{t('puppies.litter_size')}</p>
                                <p className="font-medium">{litter.puppiesCount}</p>
                            </div>
                        </div>
                    </div>

                    {litter.status !== 'Sold Out' && (
                        <div>
                            <Link to={path('contact', `?litter=${encodeURIComponent(litter.id)}`)} className="inline-block w-full sm:w-auto text-center bg-stella-blue hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl transition duration-200">
                                {t('puppies.inquire')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Litter Gallery Carousel */}
            {litter.gallery && litter.gallery.length > 0 && (
                <div className="border-t border-gray-100 p-8 bg-gray-50">
                    <SubHeading className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 text-center">{t('puppies.more_from_litter')}</SubHeading>
                    <div className="max-w-md mx-auto">
                        <ImageCarousel
                            images={litter.gallery.map((photo) => ({ src: photo.src, alt: t(photo.altKey) }))}
                            label={`${t('puppies.more_from_litter')}: ${litter.sire} x ${litter.dam}`}
                            frameClassName="aspect-[4/5]"
                            sizes="(min-width: 480px) 448px, 100vw"
                        />
                    </div>
                </div>
            )}
        </div>
        );
    };

    const processSteps = t('puppies.process.steps') as unknown as { title: string; text: string }[];

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-serif font-bold text-stella-blue mb-4">{t('puppies.title')}</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        {t('puppies.subtitle')}
                    </p>
                </div>

                {/* Available Puppies Section */}
                {AVAILABLE_PUPPIES.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stella-gold/50"></div>
                            <h2 className="text-3xl font-serif font-bold text-stella-blue uppercase tracking-widest">{t('puppies.available_title')}</h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stella-gold/50"></div>
                        </div>
                        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">{t('puppies.available_subtitle')}</p>

                        <div className="grid grid-cols-1 gap-12">
                            {AVAILABLE_PUPPIES.map((puppy, index) => (
                                <div key={puppy.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                                    <div className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                                        <div className="md:w-1/2 min-h-[400px] md:h-auto relative overflow-hidden">
                                            {puppy.images.length > 0 ? (
                                                <div className="h-full w-full absolute inset-0">
                                                    <ImageCarousel
                                                        images={puppy.images.map((src, i) => ({ src, alt: `${puppy.name} – ${t('carousel.photo')} ${i + 1}` }))}
                                                        label={puppy.name}
                                                        className="h-full"
                                                        frameClassName="h-full"
                                                        fit="cover"
                                                        sizes="(min-width: 768px) 50vw, 100vw"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-500">{t('puppies.no_image')}</div>
                                            )}
                                        </div>
                                        <div className="p-10 md:p-14 md:w-1/2 flex flex-col justify-center bg-gradient-to-br from-white to-orange-50/30">
                                            <div className="mb-6 inline-block">
                                                <span className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-green-700 text-white shadow-md shadow-green-700/20">
                                                    {t('puppies.status.available')}
                                                </span>
                                            </div>
                                            <h3 className="text-4xl font-serif font-bold text-stella-blue mb-4 leading-tight group-hover:text-stella-gold-dark transition-colors duration-300">{puppy.name}</h3>
                                            <div className="flex items-center gap-3 mb-8">
                                                <span className="px-3 py-1 bg-stella-blue/5 text-stella-blue text-sm font-semibold rounded-lg">{t(`puppies.gender.${puppy.gender.toLowerCase()}`)}</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                <span className="text-gray-500 font-medium">{puppy.color[language]}</span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                                                {puppy.description[language]}
                                            </p>
                                            <div>
                                                <Link to={path('contact', `?litter=${encodeURIComponent(puppy.litterId)}&puppy=${encodeURIComponent(puppy.id)}`)} className="inline-flex items-center justify-center w-full sm:w-auto text-center bg-stella-blue hover:bg-stella-dark text-white font-bold py-4 px-10 rounded-xl transition duration-300 shadow-lg shadow-stella-blue/30 hover:shadow-stella-blue/50 hover:-translate-y-1">
                                                    {t('puppies.inquire')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentLitters.length > 0 && (
                    <div className="space-y-12 mb-24">
                        {currentLitters.map((litter) => renderLitter(litter, 'h2'))}
                    </div>
                )}

                {/* Planned litter (PLANNED_LITTERS in constants.ts); hidden automatically once its month has passed. */}
                {upcoming && hasAvailability && (
                    <div className="mb-24 bg-stella-cream border border-stella-sand rounded-3xl p-10 text-center">
                        <CalendarClock className="mx-auto text-stella-gold mb-4" size={36} aria-hidden="true" />
                        <h2 className="text-3xl font-serif font-bold text-stella-blue mb-2">{t('puppies.next_litter_title')}</h2>
                        <p className="text-gray-600 text-lg mb-6">{fill(t('puppies.next_litter_expected'), { month: formatMonth(upcoming.expectedMonth, language) })}</p>
                        <Link to={path('contact', '?interest=waitlist')} className="inline-block w-full sm:w-auto text-center bg-stella-blue hover:bg-stella-dark text-white font-bold py-4 px-10 rounded-xl transition duration-300">
                            {t('puppies.join_waitlist')}
                        </Link>
                    </div>
                )}

                {!hasAvailability && (
                    <div className="mb-24 bg-stella-cream border border-stella-sand rounded-3xl p-10 md:p-14 text-center">
                        <PawPrint className="mx-auto text-stella-gold mb-6" size={40} />
                        <h2 className="text-3xl font-serif font-bold text-stella-blue mb-4">
                            {upcoming
                                ? fill(t('puppies.none_available_title'), { month: formatMonth(upcoming.expectedMonth, language) })
                                : t('puppies.none_available_title_no_litter')}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                            {upcoming ? t('puppies.none_available_desc') : t('puppies.none_available_desc_no_litter')}
                        </p>
                        <Link to={path('contact', '?interest=waitlist')} className="inline-block w-full sm:w-auto text-center bg-stella-blue hover:bg-stella-dark text-white font-bold py-4 px-10 rounded-xl transition duration-300">
                            {t('puppies.join_waitlist')}
                        </Link>
                    </div>
                )}

                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <h2 className="text-2xl font-serif text-gray-500 uppercase tracking-widest">{t('puppies.past_litters')}</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mb-8">
                        <time dateTime={LITTERS_UPDATED}>{fill(t('puppies.updated'), { date: formatDate(LITTERS_UPDATED, language) })}</time>
                    </p>
                    {pastLitters.length > 0 && (
                        <div className="space-y-12 mb-12">
                            {pastLitters.map((litter) => renderLitter(litter, 'h3'))}
                        </div>
                    )}
                    <PuppyLocationMap />
                </div>

                {/* How it works: the puppy process, from the site's own waitlist description */}
                <section aria-labelledby="puppy-process" className="bg-stella-sand/20 rounded-2xl p-8 md:p-12">
                    <h2 id="puppy-process" className="text-3xl font-serif font-bold text-stella-blue mb-8 text-center">{t('puppies.process.title')}</h2>
                    <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {processSteps
                            // The last step quotes the last homed litter's dates, so it needs one.
                            .filter((_, i) => i < processSteps.length - 1 || lastHomed)
                            .map((step, i) => (
                                <li key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <span className="block text-stella-gold-dark font-serif text-3xl font-bold mb-2" aria-hidden="true">{i + 1}</span>
                                    <h3 className="font-bold text-stella-dark mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {lastHomed
                                            ? fill(step.text, {
                                                date: formatDate(lastHomed.goHomeDate, language),
                                                weeks: weeksBetween(lastHomed.whelpDate, lastHomed.goHomeDate),
                                            })
                                            : step.text}
                                    </p>
                                </li>
                            ))}
                    </ol>
                    <p className="mt-8 text-center text-gray-700">{t('puppies.process.terms')}</p>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 text-center">
                        <Link to={path('faq')} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
                            {t('puppies.process.faq_link')}
                            <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        </Link>
                        <Link to={path('contact', '?interest=waitlist')} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-stella-blue hover:text-stella-gold-dark transition-colors">
                            {t('puppies.process.contact_link')}
                            <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Puppies;
