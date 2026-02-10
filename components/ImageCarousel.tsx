
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  altTexts?: string[];
  className?: string;
  adaptiveHeight?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altTexts, className = "", adaptiveHeight = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative group w-full ${className}`}>
      {adaptiveHeight ? (
        <img
          src={images[currentIndex]}
          alt={altTexts?.[currentIndex] || `Photo from Stella Maris Kennel`}
          className="w-full h-auto object-contain rounded-2xl shadow-md duration-500 ease-in-out transition-all block"
        />
      ) : (
        <div
          className="w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out transition-all shadow-md"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          role="img"
          aria-label={altTexts?.[currentIndex] || `Photo from Stella Maris Kennel`}
        ></div>
      )}

      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
        <ChevronLeft onClick={prevSlide} size={30} />
      </div>

      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
        <ChevronRight onClick={nextSlide} size={30} />
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`transition-all cursor-pointer rounded-full border border-white/50 shadow-sm ${currentIndex === slideIndex ? 'bg-stella-gold w-3 h-3' : 'bg-white/60 w-2 h-2 hover:bg-white'
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
