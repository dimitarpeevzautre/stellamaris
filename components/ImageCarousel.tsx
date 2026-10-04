import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Picture from './Picture';
import { useLanguage } from '../context/LanguageContext';
import { fill } from '../utils/litters';

export interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  /** Accessible name of the carousel, e.g. the gallery heading. */
  label: string;
  /**
   * Classes that size the frame. The frame has a fixed size, so changing slides never moves the
   * content below it. Default: 4:3. For 'cover' carousels pass e.g. 'h-full'.
   */
  frameClassName?: string;
  /** 'contain' shows whole photos on a dark backdrop; 'cover' fills the frame (cropping). */
  fit?: 'contain' | 'cover';
  /** `sizes` attribute of the slides, i.e. how wide the frame is rendered. */
  sizes?: string;
  className?: string;
}

const SWIPE_THRESHOLD_PX = 40;

/**
 * Every slide is in the HTML (so crawlers and the prerendered page see all photos and their alt
 * texts), but only the current slide and its two neighbours are displayed. The neighbours are
 * invisible and lazy-loaded, so the next/previous photo is already downloaded when the visitor
 * moves on; the others are display:none and load only when they become a neighbour.
 */
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  label,
  frameClassName = 'aspect-[4/3]',
  fit = 'contain',
  sizes = '100vw',
  className = '',
}) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!images || images.length === 0) return null;

  const count = images.length;
  const goTo = (index: number) => setCurrentIndex(((index % count) + count) % count);
  const prevSlide = () => goTo(currentIndex - 1);
  const nextSlide = () => goTo(currentIndex + 1);

  const isNeighbour = (index: number) =>
    index === (currentIndex + 1) % count || index === (currentIndex - 1 + count) % count;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (dx < 0) nextSlide();
    else prevSlide();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  const position = (index: number) =>
    fill(t('carousel.position'), { current: index + 1, total: count });

  // Arrows are always visible on touch screens (no hover there). Only devices with a real
  // hover-capable pointer fade them in on hover; keyboard focus always shows them.
  const arrowClass =
    'absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full p-2 ' +
    'bg-black/40 text-white hover:bg-black/60 transition-opacity z-10 ' +
    '[@media(hover:hover)_and_(pointer:fine)]:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div
      className={`relative group w-full ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl shadow-md ${fit === 'contain' ? 'bg-stella-dark' : ''} ${frameClassName}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((image, index) => {
          const isCurrent = index === currentIndex;
          const visible = isCurrent || isNeighbour(index);
          return (
            <div
              key={image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={position(index)}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } ${visible ? '' : 'hidden'}`}
            >
              <Picture
                src={image.src}
                alt={image.alt}
                sizes={sizes}
                className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
              />
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button type="button" onClick={prevSlide} aria-label={t('carousel.previous')} className={`${arrowClass} left-3 sm:left-5`}>
            <ChevronLeft size={28} aria-hidden="true" />
          </button>
          <button type="button" onClick={nextSlide} aria-label={t('carousel.next')} className={`${arrowClass} right-3 sm:right-5`}>
            <ChevronRight size={28} aria-hidden="true" />
          </button>

          {/* Position: visible counter, announced politely when the slide changes. */}
          <p className="absolute top-3 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white tabular-nums">
            <span aria-hidden="true">{currentIndex + 1} / {count}</span>
            <span className="sr-only" aria-live="polite" aria-atomic="true">{position(currentIndex)}</span>
          </p>

          {/* Dots: 24px tap targets around a small visible dot. On narrow phones with many photos
              they would not fit, so there the arrows, swipe and the counter are used instead. */}
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 items-center z-10 ${count > 8 ? 'hidden sm:flex' : 'flex'}`}>
            {images.map((_, slideIndex) => (
              <button
                type="button"
                key={slideIndex}
                onClick={() => goTo(slideIndex)}
                aria-label={position(slideIndex)}
                aria-current={currentIndex === slideIndex ? 'true' : undefined}
                className="group/dot inline-flex items-center justify-center w-6 h-6 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className={`block rounded-full border border-white/70 shadow-sm transition-all ${
                    currentIndex === slideIndex ? 'bg-stella-gold w-3 h-3' : 'bg-white/60 w-2 h-2 group-hover/dot:bg-white'
                  }`}
                ></span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
